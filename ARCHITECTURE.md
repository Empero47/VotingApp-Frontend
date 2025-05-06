# Voting Platform Architecture

## Backend Architecture

### Project Structure

```
src/
├── config/
│   ├── database.ts
│   └── environment.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── candidate.controller.ts
│   └── vote.controller.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── validate.middleware.ts
│   └── rate-limit.middleware.ts
├── models/
│   ├── user.model.ts
│   ├── candidate.model.ts
│   └── vote.model.ts
├── routes/
│   ├── auth.routes.ts
│   ├── candidate.routes.ts
│   └── vote.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── candidate.service.ts
│   └── vote.service.ts
├── utils/
│   ├── jwt.utils.ts
│   ├── password.utils.ts
│   └── logger.utils.ts
└── app.ts

```

### Data Flow

1. Request Flow:

   ```
   Client Request → Middleware (Auth/Validation) → Route → Controller → Service → Model → Database
   ```

2. Response Flow:
   ```
   Database → Model → Service → Controller → Response Transform → Client Response
   ```

### Authentication Flow

1. Login Process:

   ```
   Client → Validate Credentials → Generate JWT → Store Token → Return User & Token
   ```

2. Request Authentication:
   ```
   Request → Extract Token → Verify Token → Attach User → Allow/Deny Request
   ```

### Transaction Handling

#### Voting Transaction

```sql
START TRANSACTION;

-- Check if user has already voted
SELECT id FROM votes WHERE user_id = ?;

-- If no vote exists, insert new vote
INSERT INTO votes (user_id, candidate_id) VALUES (?, ?);

-- Update vote count (optional, can be calculated on demand)
UPDATE candidates
SET vote_count = (
    SELECT COUNT(*)
    FROM votes
    WHERE candidate_id = candidates.id
)
WHERE id = ?;

COMMIT;
```

### Database Indices

```sql
-- Users table indices
CREATE INDEX idx_email ON users(email);

-- Votes table indices
CREATE INDEX idx_user_vote ON votes(user_id, candidate_id);
CREATE INDEX idx_candidate_votes ON votes(candidate_id);

-- Candidates table indices
CREATE INDEX idx_candidate_party ON candidates(party);
```

### Caching Strategy

1. Candidate List Caching:

```typescript
const CACHE_TTL = 300; // 5 minutes

const getCandidates = async () => {
  const cacheKey = "candidates:list";
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const candidates = await db.candidates.findAll();
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(candidates));

  return candidates;
};
```

2. Vote Results Caching:

```typescript
const getVoteResults = async () => {
  const cacheKey = "votes:results";
  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const results = await db.candidates.findAll({
    include: [
      {
        model: db.votes,
        attributes: [[db.sequelize.fn("COUNT", "*"), "voteCount"]],
      },
    ],
    group: ["candidates.id"],
  });

  await redis.setex(cacheKey, 60, JSON.stringify(results)); // 1 minute TTL
  return results;
};
```

### Error Handling Implementation

```typescript
// error.middleware.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
      },
    });
  }

  // Log unexpected errors
  logger.error(err);

  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    },
  });
};
```

### Security Implementations

1. Password Hashing:

```typescript
// password.utils.ts
import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
```

2. JWT Implementation:

```typescript
// jwt.utils.ts
import * as jwt from "jsonwebtoken";

export const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};
```

### API Rate Limiting

```typescript
// rate-limit.middleware.ts
import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again later",
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests
  message: "Too many requests, please try again later",
});
```

### Health Check Endpoint

```typescript
// health.controller.ts
export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check database connection
    await db.sequelize.authenticate();

    // Check cache connection
    await redis.ping();

    res.status(200).json({
      status: "healthy",
      database: "connected",
      cache: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error.message,
    });
  }
};
```

## Deployment Considerations

### Production Checklist

1. Configure proper SSL/TLS
2. Set up database backups
3. Implement connection pooling
4. Configure proper logging
5. Set up monitoring (e.g., Prometheus + Grafana)
6. Implement CI/CD pipeline
7. Configure proper CORS settings
8. Set up rate limiting
9. Enable compression
10. Configure proper security headers

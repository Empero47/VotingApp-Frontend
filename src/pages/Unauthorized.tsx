
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';

const Unauthorized: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-vote-error text-5xl mb-6">🚫</div>
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You don't have permission to access this page. This area is restricted to administrators only.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline">
                Return to Home
              </Button>
            </Link>
            <Link to="/vote">
              <Button className="bg-vote-primary hover:bg-vote-secondary">
                Go to Voting
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;

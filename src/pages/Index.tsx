
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  return (
    <Layout>
      <section className="bg-gradient-to-b from-vote-primary to-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Secure. Transparent. <span className="text-vote-accent">Democratic.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Cast your vote with confidence on our state-of-the-art 
            secure online voting platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button className="bg-white text-vote-primary hover:bg-gray-100 px-8 py-6 text-lg rounded-md">
                Register to Vote
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-md">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose VotingApp?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4 text-vote-primary">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-gray-600">
                Enterprise-grade security with JWT authentication and encrypted data to ensure your vote remains private and safe.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4 text-vote-primary">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast</h3>
              <p className="text-gray-600">
                Cast your vote in seconds, with real-time results tallying and immediate confirmation.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4 text-vote-primary">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Transparent</h3>
              <p className="text-gray-600">
                Open source with auditable code, ensuring complete transparency in the voting process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <ol className="relative border-l border-vote-primary">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-vote-primary rounded-full -left-4 ring-4 ring-white">
                  1
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold">Register</h3>
                <p className="mb-4 text-gray-600">
                  Create an account with your email and password. We'll verify your identity to ensure voting integrity.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-vote-primary rounded-full -left-4 ring-4 ring-white">
                  2
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold">Login</h3>
                <p className="mb-4 text-gray-600">
                  Access your secure voting dashboard with your credentials.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-vote-primary rounded-full -left-4 ring-4 ring-white">
                  3
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold">Vote</h3>
                <p className="mb-4 text-gray-600">
                  Browse candidates, learn about their positions, and cast your secure vote.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-vote-primary rounded-full -left-4 ring-4 ring-white">
                  4
                </span>
                <h3 className="flex items-center mb-1 text-lg font-semibold">View Results</h3>
                <p className="mb-4 text-gray-600">
                  After voting closes, view the transparent results with detailed analytics.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-vote-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Make Your Voice Heard?</h2>
          <Link to="/register">
            <Button className="bg-white text-vote-primary hover:bg-gray-100 px-8 py-6 text-lg rounded-md">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

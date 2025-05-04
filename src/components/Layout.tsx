
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-vote-primary text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="mr-2">🗳️</span>
            VotingApp
          </Link>
          
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/vote" className="hover:text-white/80 text-sm md:text-base">
                  Vote
                </Link>
                <Link to="/results" className="hover:text-white/80 text-sm md:text-base">
                  Results
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-white/80 text-sm md:text-base">
                    Admin
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="bg-white text-vote-primary px-3 py-1 rounded hover:bg-white/90 text-sm md:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-white/80 text-sm md:text-base"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-vote-primary px-3 py-1 rounded hover:bg-white/90 text-sm md:text-base"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                &copy; {new Date().getFullYear()} VotingApp. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-vote-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-vote-primary">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-vote-primary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

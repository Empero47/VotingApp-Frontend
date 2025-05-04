
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Candidate } from '../api/mockApi';
import candidateService from '../api/candidateService';
import { toast } from 'sonner';
import CandidatesTable from '../components/admin/CandidatesTable';
import AddCandidateForm from '../components/admin/AddCandidateForm';
import AdminActions from '../components/admin/AdminActions';

const Admin: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (user && !isAdmin) {
      navigate('/unauthorized');
      return;
    }

    const fetchCandidates = async () => {
      try {
        const data = await candidateService.getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast.error('Failed to load candidates');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCandidates();
  }, [user, isAdmin, navigate]);

  const handleCandidateAdded = (candidate: Candidate) => {
    setCandidates([...candidates, candidate]);
  };

  const handleDelete = async (id: string) => {
    await candidateService.deleteCandidate(id);
    setCandidates(candidates.filter(candidate => candidate.id !== id));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vote-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Manage candidates and monitor the voting process
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CandidatesTable 
                candidates={candidates} 
                onDelete={handleDelete} 
              />
            </div>
            
            <div>
              <AddCandidateForm onCandidateAdded={handleCandidateAdded} />
              <AdminActions />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

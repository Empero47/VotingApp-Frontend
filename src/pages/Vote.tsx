
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import { api, Candidate } from '../api/mockApi';
import { toast } from 'sonner';
import { ArrowRight } from 'lucide-react';

const Vote: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCandidates = await api.getCandidates();
        setCandidates(fetchedCandidates);
        
        if (user) {
          const voted = api.hasVoted(user.id);
          setHasVoted(voted);
          
          if (voted) {
            const votedFor = await api.getUserVote(user.id);
            setSelectedCandidate(votedFor);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load candidates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleVote = async () => {
    if (!selectedCandidate || !user) return;
    
    setIsSubmitting(true);
    
    try {
      await api.castVote(user.id, selectedCandidate);
      setHasVoted(true);
      toast.success('Your vote has been cast successfully!');
      
      // Redirect to results after a short delay
      setTimeout(() => {
        navigate('/results');
      }, 2000);
    } catch (error) {
      console.error('Error casting vote:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cast vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vote-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading candidates...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Cast Your Vote</h1>
            <p className="text-gray-600">
              {hasVoted 
                ? 'You have already cast your vote. You can view the current results.'
                : 'Select your preferred candidate and submit your vote.'}
            </p>
          </div>
          
          {hasVoted ? (
            <div className="text-center mt-8">
              <p className="text-xl mb-6">
                Thank you for participating in the democratic process!
              </p>
              <Button 
                onClick={() => navigate('/results')}
                className="bg-vote-primary hover:bg-vote-secondary"
              >
                View Results <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {candidates.map((candidate) => (
                  <Card 
                    key={candidate.id}
                    className={`cursor-pointer transition-all ${
                      selectedCandidate === candidate.id ? 'vote-card-active' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={candidate.imageUrl} 
                            alt={candidate.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          <p className="text-gray-500">{candidate.party}</p>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className={`w-6 h-6 rounded-full border-2 ${
                            selectedCandidate === candidate.id
                              ? 'border-vote-primary bg-vote-primary'
                              : 'border-gray-300'
                          } flex items-center justify-center`}>
                            {selectedCandidate === candidate.id && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Button
                  onClick={handleVote}
                  disabled={!selectedCandidate || isSubmitting}
                  className={`${
                    selectedCandidate 
                      ? 'bg-vote-primary hover:bg-vote-secondary animate-vote-pulse' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } px-8 py-2 text-white rounded-md`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Vote'
                  )}
                </Button>
                <p className="mt-4 text-sm text-gray-500">
                  Your vote is secure and anonymous. Once submitted, it cannot be changed.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Vote;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';
import { Candidate } from '../api/mockApi';
import { toast } from 'sonner';
import candidateService from '../api/candidateService';

const Admin: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Form state for adding a new candidate
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [position, setPosition] = useState('');
  const [imageUrl, setImageUrl] = useState('https://randomuser.me/api/portraits/men/1.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newCandidate = {
        name,
        party,
        position,
        imageUrl
      };
      
      const addedCandidate = await candidateService.addCandidate(newCandidate);
      setCandidates([...candidates, addedCandidate]);
      toast.success(`Added candidate: ${name}`);
      
      // Reset form
      setName('');
      setParty('');
      setPosition('');
      setImageUrl('https://randomuser.me/api/portraits/men/1.jpg');
    } catch (error) {
      console.error('Error adding candidate:', error);
      toast.error('Failed to add candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await candidateService.deleteCandidate(id);
      setCandidates(candidates.filter(candidate => candidate.id !== id));
      toast.success('Candidate removed');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    }
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
              <Card>
                <CardHeader>
                  <CardTitle>Candidates</CardTitle>
                  <CardDescription>Manage the list of candidates for the election</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Photo</th>
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Party</th>
                          <th className="text-left py-3 px-4">Position</th>
                          <th className="text-right py-3 px-4">Votes</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((candidate) => (
                          <tr key={candidate.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <img 
                                src={candidate.imageUrl} 
                                alt={candidate.name} 
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            </td>
                            <td className="py-3 px-4">{candidate.name}</td>
                            <td className="py-3 px-4">{candidate.party}</td>
                            <td className="py-3 px-4">{candidate.position}</td>
                            <td className="py-3 px-4 text-right">{candidate.voteCount || 0}</td>
                            <td className="py-3 px-4 text-right">
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(candidate.id)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Add Candidate</CardTitle>
                  <CardDescription>Create a new candidate for the election</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="party">Party</Label>
                      <Input
                        id="party"
                        value={party}
                        onChange={(e) => setParty(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-vote-primary hover:bg-vote-secondary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Adding...
                        </span>
                      ) : 'Add Candidate'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => navigate('/results')}>
                    View Results
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;

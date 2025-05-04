
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api, Candidate } from '../api/mockApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Results: React.FC = () => {
  const [results, setResults] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api.getResults();
        setResults(data);
        
        // Calculate total votes
        const total = data.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);
        setTotalVotes(total);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to load voting results. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, []);

  // Prepare chart data
  const chartData = results.map(candidate => ({
    name: candidate.name,
    votes: candidate.voteCount || 0,
  }));

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vote-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
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
            <h1 className="text-3xl font-bold mb-2">Election Results</h1>
            <p className="text-gray-600">
              Live results from all votes cast. Total votes: {totalVotes}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Candidate Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.map((candidate, index) => (
                    <div key={candidate.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <span className={`${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 
                            index === 2 ? 'bg-amber-700' : 'bg-gray-200'
                          } w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{candidate.name}</span>
                        </div>
                        <span className="font-semibold">
                          {candidate.voteCount || 0} votes
                        </span>
                      </div>
                      <Progress 
                        value={totalVotes > 0 ? ((candidate.voteCount || 0) / totalVotes) * 100 : 0} 
                        className={`h-2 ${
                          index === 0 ? 'bg-gray-100' : 'bg-gray-100'
                        }`}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1 mb-4">
                        <span>{candidate.party}</span>
                        <span>
                          {totalVotes > 0 
                            ? `${(((candidate.voteCount || 0) / totalVotes) * 100).toFixed(1)}%` 
                            : '0%'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Candidate</th>
                      <th className="text-left py-3 px-4">Party</th>
                      <th className="text-left py-3 px-4">Position</th>
                      <th className="text-right py-3 px-4">Votes</th>
                      <th className="text-right py-3 px-4">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((candidate, index) => (
                      <tr key={candidate.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <img 
                              src={candidate.imageUrl} 
                              alt={candidate.name} 
                              className="w-8 h-8 rounded-full mr-3"
                            />
                            {candidate.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">{candidate.party}</td>
                        <td className="py-3 px-4">{candidate.position}</td>
                        <td className="py-3 px-4 text-right font-medium">{candidate.voteCount || 0}</td>
                        <td className="py-3 px-4 text-right">
                          {totalVotes > 0 
                            ? `${(((candidate.voteCount || 0) / totalVotes) * 100).toFixed(1)}%` 
                            : '0%'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Results;

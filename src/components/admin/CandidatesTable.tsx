
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Candidate } from '../../api/mockApi';
import { toast } from 'sonner';

interface CandidatesTableProps {
  candidates: Candidate[];
  onDelete: (id: string) => void;
}

const CandidatesTable: React.FC<CandidatesTableProps> = ({ candidates, onDelete }) => {
  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast.success('Candidate removed');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    }
  };

  return (
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
  );
};

export default CandidatesTable;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Candidate } from '../../api/mockApi';
import { toast } from 'sonner';
import candidateService from '../../api/candidateService';

interface AddCandidateFormProps {
  onCandidateAdded: (candidate: Candidate) => void;
}

const AddCandidateForm: React.FC<AddCandidateFormProps> = ({ onCandidateAdded }) => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [position, setPosition] = useState('');
  const [imageUrl, setImageUrl] = useState('https://randomuser.me/api/portraits/men/1.jpg');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onCandidateAdded(addedCandidate);
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

  return (
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
  );
};

export default AddCandidateForm;

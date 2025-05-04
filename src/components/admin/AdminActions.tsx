
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminActions: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default AdminActions;

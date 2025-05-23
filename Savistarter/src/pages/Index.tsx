import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import FloatingElements from '@/components/FloatingElements';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 cloud-border flex flex-col items-center justify-center relative overflow-hidden">
      <FloatingElements />
      
      <div className="z-10 flex flex-col items-center justify-center gap-12 px-4 animate-fade-in">
        <Logo size="large" className="animate-float" />
        
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-gray-500 italic">Begin your English adventure!</p>
          <Button onClick={handleStartClick} className="mt-4">
            Login <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 text-center text-xs text-gray-400 z-10">
        © 2023 SAVI English Explorer - Fun Learning for Young Students
      </div>
    </div>
  );
};

export default Index;

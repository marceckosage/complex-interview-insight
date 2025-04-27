
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import { toast } from 'sonner';

export default function Auth() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error('Failed to sign in with Google');
    }
  };

  return (
    <PageLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-sm space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter text-brand-gray-900">
              Welcome Back
            </h1>
            <p className="text-brand-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          <Button 
            onClick={handleGoogleSignIn}
            className="w-full"
            size="lg"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

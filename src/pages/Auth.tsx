import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  
  const { signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: 'Authentication Failed',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background grid-pattern">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Intel Dashboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Real-time global intelligence monitoring and analysis platform
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6 text-left max-w-md">
            <div className="intel-card p-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <h3 className="font-medium text-sm">Live Monitoring</h3>
              <p className="text-xs text-muted-foreground mt-1">Real-time global event tracking</p>
            </div>
            <div className="intel-card p-4">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-accent"></div>
              </div>
              <h3 className="font-medium text-sm">Secure Access</h3>
              <p className="text-xs text-muted-foreground mt-1">Encrypted data transmission</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="intel-card p-8">
            <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
              <Shield className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">Intel Dashboard</span>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center">
                Access Terminal
              </h2>
              <p className="text-muted-foreground text-center text-sm mt-2">
                Sign in with your verified Google account
              </p>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 font-medium bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </span>
              )}
            </Button>

            <div className="mt-8 p-4 rounded-lg bg-secondary/30 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                <span className="text-primary font-medium">Secure Authentication</span>
                <br />
                Only verified Google accounts with authorized access can sign in to this platform.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Secure connection established • TLS 1.3 encrypted
          </p>
        </div>
      </div>
    </div>
  );
}

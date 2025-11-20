import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
    toast.success('Welcome to TaskFlow!');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary-glow/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/25">
            <CheckSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-muted-foreground text-lg">
            Organize your life, one task at a time
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter any email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                No registration required - just enter any email to continue
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all duration-300 text-base font-medium group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-primary mb-1">∞</div>
                <div className="text-muted-foreground">Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">📊</div>
                <div className="text-muted-foreground">Analytics</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">🎯</div>
                <div className="text-muted-foreground">Goals</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Simple. Beautiful. Productive.
        </p>
      </div>
    </div>
  );
};

export default Login;

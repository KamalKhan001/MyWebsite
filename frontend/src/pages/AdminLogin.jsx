import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyAuth, setAlreadyAuth] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    const verify = async () => {
      const token = authAPI.getToken();
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        await authAPI.me();
        setAlreadyAuth(true);
      } catch {
        authAPI.clearToken();
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  if (alreadyAuth) return <Navigate to="/admin/dashboard" replace />;
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <p className="text-blue-200">Checking session...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await authAPI.login(email.trim().toLowerCase(), password);
      authAPI.setToken(data.access_token);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      const detail = error?.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Login failed. Check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30 mb-4">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">KK-TRUST Admin</h1>
          <p className="text-blue-200 text-sm">Sign in to manage inquiries</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="admin-email"
                    type="email"
                    data-testid="admin-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    autoComplete="username"
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="admin-password"
                    type="password"
                    data-testid="admin-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="pl-10 border-gray-300"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                data-testid="admin-login-btn"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 disabled:opacity-60"
              >
                <LogIn className="mr-2" size={18} />
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-blue-300/70 mt-6">
          KK-TRUST COMP &middot; Admin Portal
        </p>
      </div>
    </div>
  );
};

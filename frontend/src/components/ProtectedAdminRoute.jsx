import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

/**
 * Wraps a route to ensure only authenticated admins can view it.
 * While verifying the stored token, shows a small loading state.
 */
export const ProtectedAdminRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    const verify = async () => {
      const token = authAPI.getToken();
      if (!token) {
        setStatus('denied');
        return;
      }
      try {
        await authAPI.me();
        setStatus('ok');
      } catch {
        authAPI.clearToken();
        setStatus('denied');
      }
    };
    verify();
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Verifying session...</p>
      </div>
    );
  }
  if (status === 'denied') return <Navigate to="/admin/login" replace />;
  return children;
};

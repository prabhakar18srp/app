import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error, expired
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await axios.get(`${API}/auth/verify-email?token=${token}`);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        if (error.response?.status === 400) {
          setMessage('Verification link has expired');
        } else {
          setMessage(error.response?.data?.detail || 'Verification failed');
        }
      }
    };

    verifyEmail();
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700">
        <div className="text-center">
          {status === 'loading' && (
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 mx-auto text-purple-400 animate-spin" />
              <h2 className="text-2xl font-bold text-white">Verifying your email...</h2>
              <p className="text-slate-400">Please wait while we verify your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
              <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
              <p className="text-slate-400">{message}</p>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 mt-6"
              >
                Go to Homepage
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="w-16 h-16 mx-auto text-red-400" />
              <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
              <p className="text-slate-400">{message}</p>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 mt-6"
              >
                Go to Homepage
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

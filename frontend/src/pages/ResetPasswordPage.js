import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Zap, Mail, ArrowLeft, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/reset-password', { email });
      setEmailSent(true);
      toast.success('Password reset link sent! Please check your email.');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4" data-testid="reset-password-page">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 mb-4">
            <Shield className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Reset your password</h1>
          <p className="mt-2 text-slate-600 text-center">
            {emailSent 
              ? "We've sent a 6-digit code to your email" 
              : "Enter your email and we'll send you a link to reset your password."}
          </p>
        </div>

        {emailSent ? (
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Check your email</h2>
                <p className="text-slate-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800"
                  data-testid="back-to-home-button"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border-slate-200">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12"
                      data-testid="reset-email-input"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800"
                  disabled={isLoading}
                  data-testid="send-reset-link-button"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send reset link
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
            data-testid="back-to-signin-link"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

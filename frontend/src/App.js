import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import MyCampaignsPage from './pages/MyCampaignsPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AuthModal from './components/AuthModal';
import AIChatWidget from './components/AIChatWidget';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Merge Supabase user with app_metadata to include is_admin
        const userData = {
          ...session.user,
          is_admin: session.user.app_metadata?.is_admin || false
        };
        setUser(userData);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        // Merge Supabase user with app_metadata to include is_admin
        const userData = {
          ...session.user,
          is_admin: session.user.app_metadata?.is_admin || false
        };
        setUser(userData);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen" data-testid="loading-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuth, handleLogout, setShowAuthModal }}>
      <BrowserRouter>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/campaign/:id" element={<CampaignDetailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route 
              path="/create-campaign" 
              element={user ? <CreateCampaignPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/my-campaigns" 
              element={user ? <MyCampaignsPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/user-dashboard" 
              element={user ? <UserDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/admin" 
              element={user?.is_admin ? <AdminDashboard /> : <Navigate to="/" />} 
            />
            <Route 
              path="/analytics" 
              element={user ? <AnalyticsPage /> : <Navigate to="/" />} 
            />
          </Routes>
          
          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
          <AIChatWidget />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

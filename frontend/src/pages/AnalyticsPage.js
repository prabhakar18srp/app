import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, DollarSign, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';
import CompetitorAnalysis from '../components/Analytics/CompetitorAnalysis';
import MonteCarloSimulator from '../components/Analytics/MonteCarloSimulator';
import SuccessPrediction from '../components/Analytics/SuccessPrediction';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axiosInstance.get(`${API}/campaigns`);
      setCampaigns(response.data);
      if (response.data.length > 0) {
        setSelectedCampaign(response.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignChange = (campaignId) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    setSelectedCampaign(campaign);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!selectedCampaign) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-slate-100" data-testid="analytics-page">
        <div className="container px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-800">No Campaigns Available</h1>
          <p className="text-slate-600 mb-8">Create your first campaign to access analytics.</p>
          <Button onClick={() => navigate('/create-campaign')}>
            Create Campaign
          </Button>
        </div>
      </div>
    );
  }

  const fundedPercentage = ((selectedCampaign.raised_amount / selectedCampaign.goal_amount) * 100).toFixed(1);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-slate-50 to-slate-100" data-testid="analytics-predictions-page">
      <div className="container px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-5xl font-bold mb-4 text-slate-900">Analytics & Predictions</h1>
          <p className="text-lg text-slate-600">Advanced AI-powered insights for your crowdfunding campaigns</p>
        </div>

        {/* Campaign Selector */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <Select value={selectedCampaign.id} onValueChange={handleCampaignChange}>
            <SelectTrigger className="w-full bg-white border-slate-300 h-14 text-lg text-slate-900 data-[placeholder]:text-slate-600" data-testid="campaign-selector">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 max-h-80">
              {campaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id} className="text-slate-900 text-base py-3 hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900">
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Campaign Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Goal Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-900 mb-1">
                ₹{selectedCampaign.goal_amount.toLocaleString()}
              </p>
              <p className="text-sm text-blue-700 font-medium">Goal</p>
            </div>
          </div>

          {/* Raised Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-900 mb-1">
                ₹{selectedCampaign.raised_amount.toLocaleString()}
              </p>
              <p className="text-sm text-green-700 font-medium">Raised</p>
            </div>
          </div>

          {/* Funded Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-900 mb-1">
                {fundedPercentage}%
              </p>
              <p className="text-sm text-purple-700 font-medium">Funded</p>
            </div>
          </div>
        </div>

        {/* Analytics Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <MonteCarloSimulator campaign={selectedCampaign} />
            <SuccessPrediction campaign={selectedCampaign} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <CompetitorAnalysis campaign={selectedCampaign} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

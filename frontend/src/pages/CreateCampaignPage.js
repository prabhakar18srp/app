import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import axiosInstance from '../utils/axios';
import { Button } from '../components/ui/button';
import { Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import CampaignBasics from '../components/CreateCampaign/CampaignBasics';
import RewardTiers from '../components/CreateCampaign/RewardTiers';
import AIOptimizer from '../components/CreateCampaign/AIOptimizer';

const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [campaignData, setCampaignData] = useState({
    title: '',
    description: '',
    category: '',
    goal_amount: '',
    duration_days: 30,
    status: 'active',
    tags: [],
    reward_tiers: [{ amount: '', description: '' }],
    image_url: ''
  });

  const steps = [
    { number: 1, name: 'Campaign Basics', component: CampaignBasics },
    { number: 2, name: 'Reward Tiers', component: RewardTiers },
    { number: 3, name: 'AI Optimization', component: AIOptimizer }
  ];

  const handleDataChange = (newData) => {
    setCampaignData(newData);
  };

  const handleNext = () => {
    // Validation for step 1
    if (currentStep === 1) {
      if (!campaignData.title || !campaignData.description || !campaignData.category || !campaignData.goal_amount) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Final validation
    if (!campaignData.title || !campaignData.description || !campaignData.category || !campaignData.goal_amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const validTiers = campaignData.reward_tiers.filter(tier => tier.amount && tier.description);
      const tagsArray = campaignData.tags || [];
      
      const payload = {
        title: campaignData.title,
        description: campaignData.description,
        category: campaignData.category,
        goal_amount: parseFloat(campaignData.goal_amount),
        duration_days: parseInt(campaignData.duration_days),
        status: campaignData.status,
        tags: tagsArray,
        reward_tiers: validTiers.map(tier => ({ 
          amount: parseFloat(tier.amount), 
          description: tier.description 
        })),
        image_url: campaignData.image_url || null
      };

      const response = await axiosInstance.post('/campaigns/extended', payload);
      toast.success('Campaign created successfully!');
      navigate(`/campaign/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep === step.number 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg scale-110' 
                      : currentStep > step.number
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
                </div>
                <span className={`mt-2 text-sm font-medium whitespace-nowrap ${
                  currentStep === step.number ? 'text-purple-600' : 'text-slate-500'
                }`}>
                  {step.name}
                </span>
              </div>
            </motion.div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const CurrentStepComponent = steps[currentStep - 1].component;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Authentication Required</h2>
          <p className="text-slate-600">Please log in to create a campaign.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12" data-testid="create-campaign-page">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-white/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create New Campaign
          </h1>
          <p className="text-slate-600 text-lg">Launch your crowdfunding project with AI assistance</p>
        </motion.div>
        
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}
              </span>
              <span className="text-sm font-semibold text-purple-600">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {renderStepIndicator()}
        
        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentStepComponent data={campaignData} onChange={handleDataChange} />
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-8"
        >
          {currentStep > 1 ? (
            <Button 
              variant="outline"
              onClick={handleBack}
              className="px-8 py-6 text-lg border-2 hover:bg-white"
              data-testid={`back-to-step-${currentStep - 1}-button`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <Button 
              onClick={handleNext}
              className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
              data-testid={`next-to-step-${currentStep + 1}-button`}
            >
              Next
              <Check className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-6 text-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
              data-testid="submit-campaign-button"
            >
              {loading ? 'Creating Campaign...' : 'Create Campaign'}
              <Check className="w-5 h-5 ml-2" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;

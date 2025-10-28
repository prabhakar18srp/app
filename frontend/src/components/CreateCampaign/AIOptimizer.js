import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import axiosInstance from "../../utils/axios";
import {
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function AIOptimizer({ data, onChange }) {
  const [isOptimizing, setIsOptimizing] = useState({});
  const [suggestions, setSuggestions] = useState({});

  const optimizationFeatures = [
    {
      id: "title",
      title: "Optimize Title",
      description: "Generate compelling campaign titles that attract backers",
      icon: Target,
      color: "from-blue-500 to-cyan-400"
    },
    {
      id: "description",
      title: "Enhance Description",
      description: "Improve your campaign story with persuasive copy",
      icon: Brain,
      color: "from-purple-500 to-pink-400"
    },
    {
      id: "success_prediction",
      title: "Success Prediction",
      description: "Get AI insights on your campaign's success probability",
      icon: TrendingUp,
      color: "from-green-500 to-teal-400"
    },
    {
      id: "marketing_strategy",
      title: "Marketing Strategy",
      description: "Generate a comprehensive marketing plan",
      icon: Lightbulb,
      color: "from-orange-500 to-red-400"
    }
  ];

  const validateData = () => {
    if (!data.title || !data.description || !data.category || !data.goal_amount) {
      toast.error('Please fill in all basic fields first');
      return false;
    }
    return true;
  };

  const optimizeFeature = async (featureId) => {
    if (!validateData()) return;

    setIsOptimizing(prev => ({ ...prev, [featureId]: true }));

    try {
      let response;
      
      switch (featureId) {
        case "title":
          response = await axiosInstance.post('/ai/optimize-title', {
            title: data.title,
            description: data.description,
            category: data.category
          });
          setSuggestions(prev => ({ ...prev, [featureId]: { titles: response.data.titles } }));
          toast.success('Title suggestions generated!');
          break;

        case "description":
          response = await axiosInstance.post('/ai/enhance-description', {
            title: data.title,
            description: data.description,
            category: data.category,
            goal_amount: parseFloat(data.goal_amount)
          });
          setSuggestions(prev => ({ 
            ...prev, 
            [featureId]: { improved_description: response.data.enhanced_description } 
          }));
          toast.success('Description enhanced!');
          break;

        case "success_prediction":
          const validTiers = (data.reward_tiers || []).filter(tier => tier.amount && tier.description);
          response = await axiosInstance.post('/ai/success-prediction', {
            title: data.title,
            description: data.description,
            category: data.category,
            goal_amount: parseFloat(data.goal_amount),
            reward_tiers: validTiers.map(tier => ({ 
              amount: parseFloat(tier.amount), 
              description: tier.description 
            }))
          });
          
          setSuggestions(prev => ({ 
            ...prev, 
            [featureId]: {
              probability: response.data.success_percentage / 100,
              explanation: response.data.analysis,
              recommendations: response.data.recommendations || []
            }
          }));
          toast.success('Success prediction generated!');
          break;

        case "marketing_strategy":
          response = await axiosInstance.post('/ai/marketing-strategy', {
            title: data.title,
            description: data.description,
            category: data.category,
            goal_amount: parseFloat(data.goal_amount)
          });
          
          let strategyText = response.data.overview || '';
          if (response.data.channels) {
            strategyText += '\n\nMarketing Channels:\n';
            response.data.channels.forEach(channel => {
              strategyText += `\n• ${channel.name} (${channel.priority} priority)\n  ${channel.strategy}`;
            });
          }
          
          setSuggestions(prev => ({ 
            ...prev, 
            [featureId]: { strategy: strategyText } 
          }));
          toast.success('Marketing strategy generated!');
          break;

        default:
          break;
      }

    } catch (error) {
      console.error(`Error optimizing ${featureId}:`, error);
      toast.error(`Failed to optimize ${featureId}`);
    } finally {
      setIsOptimizing(prev => ({ ...prev, [featureId]: false }));
    }
  };

  const applySuggestion = (featureId, value) => {
    const updates = { ...data };

    switch (featureId) {
      case "title":
        updates.title = value;
        toast.success('Title applied!');
        break;
      case "description":
        updates.description = value;
        toast.success('Description applied!');
        break;
      default:
        break;
    }

    onChange(updates);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            AI Campaign Optimizer
          </CardTitle>
          <p className="text-slate-600 mt-2">
            Enhance your campaign with AI-powered suggestions and insights
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {optimizationFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => optimizeFeature(feature.id)}
                      disabled={isOptimizing[feature.id]}
                      variant="outline"
                      size="sm"
                      className="hover:bg-white"
                      data-testid={`${feature.id}-button`}
                    >
                      {isOptimizing[feature.id] ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {isOptimizing[feature.id] ? "Optimizing..." : "Optimize"}
                    </Button>
                  </div>

                  {/* Display suggestions */}
                  <AnimatePresence>
                    {suggestions[feature.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-slate-50 rounded-xl"
                      >
                        {feature.id === "title" && suggestions[feature.id].titles && (
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-800 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Suggested Titles:
                            </h4>
                            {suggestions[feature.id].titles.map((title, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                                <span className="text-sm flex-1">{title}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => applySuggestion(feature.id, title)}
                                  className="text-blue-600 hover:bg-blue-50"
                                  data-testid={`use-title-${idx}-button`}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Use
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {feature.id === "description" && suggestions[feature.id].improved_description && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-slate-800 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Improved Description:
                            </h4>
                            <div className="p-4 bg-white rounded-lg border border-slate-200 max-h-64 overflow-y-auto">
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                {suggestions[feature.id].improved_description}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => applySuggestion(feature.id, suggestions[feature.id].improved_description)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                              data-testid="apply-description-button"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Apply Description
                            </Button>
                          </div>
                        )}

                        {feature.id === "success_prediction" && suggestions[feature.id].probability !== undefined && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="text-center p-4 bg-white rounded-xl">
                                <div className={`text-3xl font-bold ${
                                  suggestions[feature.id].probability > 0.7 ? 'text-green-600' :
                                  suggestions[feature.id].probability > 0.4 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`}>
                                  {(suggestions[feature.id].probability * 100).toFixed(0)}%
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Success Chance</div>
                              </div>
                              <Badge className={`${
                                suggestions[feature.id].probability > 0.7 ? 'bg-green-100 text-green-800' :
                                suggestions[feature.id].probability > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              } border-0 px-3 py-1`}>
                                {suggestions[feature.id].probability > 0.7 ? 'High Confidence' :
                                 suggestions[feature.id].probability > 0.4 ? 'Medium Confidence' : 'Low Confidence'}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-700 p-3 bg-white rounded-lg">
                              {suggestions[feature.id].explanation}
                            </p>
                            {suggestions[feature.id].recommendations && suggestions[feature.id].recommendations.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="font-medium text-slate-800 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-blue-500" />
                                  Recommendations:
                                </h5>
                                <div className="space-y-2">
                                  {suggestions[feature.id].recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-white rounded-lg">
                                      <span className="text-green-500 mt-1">•</span>
                                      <span className="text-sm text-slate-600 flex-1">{rec}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {feature.id === "marketing_strategy" && suggestions[feature.id].strategy && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-slate-800 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              Marketing Strategy:
                            </h4>
                            <div className="p-4 bg-white rounded-lg border border-slate-200 max-h-96 overflow-y-auto">
                              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                                {suggestions[feature.id].strategy}
                              </pre>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Pro Tip */}
          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Pro Tip
            </h4>
            <p className="text-sm text-purple-700">
              Use AI optimization to enhance your campaign content and get data-driven insights for success. 
              The more detailed your campaign information, the better the AI suggestions will be!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

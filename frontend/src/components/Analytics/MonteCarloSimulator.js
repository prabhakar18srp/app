import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import axiosInstance from '../../utils/axios';
import { BarChart3, Play } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MonteCarloSimulator({ campaign }) {
  const [simulation, setSimulation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = async () => {
    if (!campaign) return;

    setIsRunning(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`${API}/analytics/monte-carlo/${campaign.id}`);
      setSimulation(response.data);
    } catch (error) {
      console.error('Error running simulation:', error);
      setError('Failed to run simulation. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  if (!campaign) {
    return (
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-full">
        <CardContent className="p-6 text-center text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3" />
          Select a campaign to run Monte Carlo simulation
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border border-slate-200 bg-white">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Monte Carlo Simulation
        </CardTitle>
        <p className="text-slate-600 text-sm mt-1">
          Predict funding progression with statistical modeling
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {isRunning ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
            <p className="text-slate-600">Running 10,000 simulations...</p>
          </div>
        ) : simulation ? (
          <div className="space-y-6">
            {/* Scenarios */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
                <div className="text-2xl font-bold text-red-700 mb-1">
                  ₹{simulation.pessimistic?.toLocaleString() || '0'}
                </div>
                <div className="text-xs font-medium text-slate-700">Pessimistic</div>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-700 mb-1">
                  ₹{simulation.realistic?.toLocaleString() || '0'}
                </div>
                <div className="text-xs font-medium text-slate-700">Realistic</div>
              </div>
              <div className="text-center p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-2xl font-bold text-green-700 mb-1">
                  ₹{simulation.optimistic?.toLocaleString() || '0'}
                </div>
                <div className="text-xs font-medium text-slate-700">Optimistic</div>
              </div>
            </div>

            {/* Success Probability */}
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Success Probability</h3>
                <div className="text-4xl font-bold text-slate-900">
                  {simulation.success_probability?.toFixed(0) || 0}%
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-500"
                  style={{ width: `${simulation.success_probability || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Chart */}
            {simulation.progression_data && simulation.progression_data.length > 0 && (
              <div className="h-80 w-full bg-white rounded-xl p-6 border border-slate-200">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulation.progression_data.slice(0, 25)}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#94a3b8"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value?.toLocaleString()}`, 'Projected']}
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fill="url(#colorAmount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Key Insights */}
            {simulation.key_insights && simulation.key_insights.length > 0 && (
              <div className="p-5 bg-white rounded-xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Key Insights:</h3>
                <ul className="space-y-3">
                  {simulation.key_insights.slice(0, 3).map((insight, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex gap-3 leading-relaxed">
                      <span className="text-blue-500 font-bold text-lg mt-0.5 flex-shrink-0">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={runSimulation}
              variant="outline"
              size="sm"
              className="w-full hover:bg-blue-50"
              data-testid="run-new-simulation-button"
            >
              <Play className="w-4 h-4 mr-2" />
              Run New Simulation
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Button 
              onClick={runSimulation} 
              className="bg-blue-500 hover:bg-blue-600"
              data-testid="run-simulation-button"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Monte Carlo Simulation
            </Button>
          </div>
        )}
        {error && (
          <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

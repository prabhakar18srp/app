import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Gift, Plus, Trash2 } from "lucide-react";

export default function RewardTiers({ data, onChange }) {
  const rewardTiers = data.reward_tiers || [{ amount: '', description: '' }];

  const addRewardTier = () => {
    onChange({ 
      ...data, 
      reward_tiers: [...rewardTiers, { amount: '', description: '' }] 
    });
  };

  const removeRewardTier = (index) => {
    if (rewardTiers.length > 1) {
      onChange({ 
        ...data, 
        reward_tiers: rewardTiers.filter((_, i) => i !== index) 
      });
    }
  };

  const updateRewardTier = (index, field, value) => {
    const updatedTiers = rewardTiers.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    );
    onChange({ ...data, reward_tiers: updatedTiers });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm" data-testid="reward-tiers-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Gift className="w-6 h-6 text-green-500" />
            Reward Tiers
          </CardTitle>
          <p className="text-slate-600 mt-2">Create reward tiers for your backers</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {rewardTiers.map((tier, index) => (
            <div key={index} className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-slate-900 text-lg">Tier {index + 1}</h4>
                {rewardTiers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRewardTier(index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    data-testid={`remove-tier-${index}-button`}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Amount (₹) *</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={tier.amount}
                    onChange={(e) => updateRewardTier(index, 'amount', e.target.value)}
                    className="p-3"
                    data-testid={`tier-${index}-amount-input`}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Description *</Label>
                  <Input
                    placeholder="Digital copy of the product"
                    value={tier.description}
                    onChange={(e) => updateRewardTier(index, 'description', e.target.value)}
                    className="p-3"
                    data-testid={`tier-${index}-description-input`}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addRewardTier}
            className="w-full border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 py-6 text-slate-600 hover:text-blue-600"
            data-testid="add-reward-tier-button"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Reward Tier
          </Button>

          {/* Helpful Tips */}
          <div className="p-4 bg-green-50 rounded-xl mt-4">
            <h4 className="font-semibold text-green-800 mb-2">💡 Tips for Reward Tiers</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Offer 3-5 reward tiers at different price points</li>
              <li>• Make early bird rewards attractive to gain momentum</li>
              <li>• Ensure higher tiers provide significant added value</li>
              <li>• Keep reward descriptions clear and specific</li>
              <li>• Consider production and shipping costs in pricing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

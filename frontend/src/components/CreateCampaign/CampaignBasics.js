import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Target, DollarSign, Calendar, Tag, X, Activity } from "lucide-react";

export default function CampaignBasics({ data, onChange }) {
  const categories = [
    "Technology", "Health", "Food", "Environment", "Education", 
    "Art", "Film", "Music", "Games", "Fashion"
  ];

  const handleInputChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addTag = (newTag) => {
    const currentTags = data.tags || [];
    if (newTag && !currentTags.includes(newTag)) {
      onChange({ ...data, tags: [...currentTags, newTag] });
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = data.tags || [];
    onChange({ ...data, tags: currentTags.filter(tag => tag !== tagToRemove) });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      addTag(e.target.value.trim());
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm" data-testid="campaign-basics-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-500" />
            Campaign Basics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold text-slate-900">Campaign Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Give your campaign a compelling title"
              className="text-lg p-3"
              required
              data-testid="campaign-title-input"
            />
          </div>

          {/* Campaign Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold text-slate-900">Campaign Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project, what you're creating, and why people should support you..."
              className="min-h-32 p-3"
              data-testid="campaign-description-input"
            />
          </div>

          {/* Goal and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-base font-semibold flex items-center gap-2 text-slate-900">
                <DollarSign className="w-4 h-4" />
                Funding Goal (₹) *
              </Label>
              <Input
                id="goal"
                type="number"
                value={data.goal_amount}
                onChange={(e) => handleInputChange('goal_amount', e.target.value)}
                placeholder="5000"
                className="p-3"
                min="1"
                required
                data-testid="campaign-goal-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold text-slate-900">Category *</Label>
              <Select value={data.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="p-3 text-slate-900" data-testid="campaign-category-select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-slate-900 hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2 text-slate-900">
                <Calendar className="w-4 h-4" />
                Campaign Duration (days) *
              </Label>
              <Input
                id="duration"
                type="number"
                value={data.duration_days}
                onChange={(e) => handleInputChange('duration_days', parseInt(e.target.value) || 30)}
                min="1"
                max="60"
                className="p-3"
                required
                data-testid="campaign-duration-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2 text-slate-900">
                <Activity className="w-4 h-4" />
                Status *
              </Label>
              <Select value={data.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="p-3 text-slate-900" data-testid="campaign-status-select">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="draft" className="text-slate-900 hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900">Draft</SelectItem>
                  <SelectItem value="active" className="text-slate-900 hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2 text-slate-900">
              <Tag className="w-4 h-4" />
              Tags
            </Label>
            <Input
              placeholder="Add tags (press Enter to add)"
              onKeyPress={handleKeyPress}
              className="p-3"
              data-testid="campaign-tags-input"
            />
            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-red-100"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Helpful Tips */}
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for Success</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Make your title specific and benefit-focused</li>
              <li>• Set a realistic funding goal based on actual costs</li>
              <li>• Choose the most relevant category for better discoverability</li>
              <li>• Optimal campaign duration is 30-45 days</li>
              <li>• Use relevant tags to help backers find your project</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

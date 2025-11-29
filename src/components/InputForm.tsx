import React, { useState } from 'react';
import { Zap, Loader2 } from 'lucide-react';
import { ContentInputs } from '../services/contentGenerator';

interface InputFormProps {
  onGenerate: (inputs: ContentInputs) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [inputs, setInputs] = useState<ContentInputs>({
    niche: '',
    productLink: '',
    targetAudience: '',
    tone: 'Professional',
    mainGoal: 'Grow Followers'
  });

  const [errors, setErrors] = useState<Partial<ContentInputs>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ContentInputs> = {};
    
    if (!inputs.niche.trim()) {
      newErrors.niche = 'Niche/Topic is required';
    }
    
    if (!inputs.targetAudience.trim()) {
      newErrors.targetAudience = 'Target Audience is required';
    }
    
    if (inputs.productLink && !inputs.productLink.match(/^https?:\/\/.+/)) {
      newErrors.productLink = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate(inputs);
    }
  };

  const handleInputChange = (field: keyof ContentInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Content Generation Input
            </h1>
          </div>
          <p className="text-blue-200 text-lg">
            Transform your niche into viral content across all platforms
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Niche/Topic */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-blue-200 mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Niche/Topic *
                </span>
              </label>
              <textarea
                value={inputs.niche}
                onChange={(e) => handleInputChange('niche', e.target.value)}
                placeholder="e.g., Fitness for busy moms, AI productivity tools for entrepreneurs, Personal finance for college students..."
                className={`w-full h-24 bg-slate-900/70 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                  errors.niche ? 'border-red-500' : 'border-slate-600'
                }`}
                disabled={isLoading}
              />
              {errors.niche && <p className="text-red-400 text-sm mt-1">{errors.niche}</p>}
            </div>

            {/* Product/Affiliate Link */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  Product/Affiliate Link
                </span>
              </label>
              <input
                type="url"
                value={inputs.productLink}
                onChange={(e) => handleInputChange('productLink', e.target.value)}
                placeholder="https://your-product-link.com"
                className={`w-full bg-slate-900/70 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                  errors.productLink ? 'border-red-500' : 'border-slate-600'
                }`}
                disabled={isLoading}
              />
              {errors.productLink && <p className="text-red-400 text-sm mt-1">{errors.productLink}</p>}
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Target Audience *
                </span>
              </label>
              <textarea
                value={inputs.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="e.g., Working mothers aged 25-40 who struggle with time management, Tech entrepreneurs looking to automate their workflows..."
                className={`w-full h-24 bg-slate-900/70 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all ${
                  errors.targetAudience ? 'border-red-500' : 'border-slate-600'
                }`}
                disabled={isLoading}
              />
              {errors.targetAudience && <p className="text-red-400 text-sm mt-1">{errors.targetAudience}</p>}
            </div>

            {/* Tone/Personality */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Tone/Personality
              </label>
              <select
                value={inputs.tone}
                onChange={(e) => handleInputChange('tone', e.target.value as ContentInputs['tone'])}
                className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                disabled={isLoading}
              >
                <option value="Professional">Professional</option>
                <option value="Humorous">Humorous</option>
                <option value="Luxury">Luxury</option>
                <option value="Inspiring">Inspiring</option>
                <option value="Aggressive Marketing">Aggressive Marketing</option>
                <option value="Friendly Mentor">Friendly Mentor</option>
              </select>
            </div>

            {/* Main Goal */}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-3">
                Main Goal
              </label>
              <select
                value={inputs.mainGoal}
                onChange={(e) => handleInputChange('mainGoal', e.target.value as ContentInputs['mainGoal'])}
                className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                disabled={isLoading}
              >
                <option value="Grow Followers">Grow Followers</option>
                <option value="Drive Affiliate Clicks">Drive Affiliate Clicks</option>
                <option value="Sell Product">Sell Product</option>
                <option value="Build Brand Awareness">Build Brand Awareness</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-semibold px-8 py-4 rounded-lg hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Generate Viral Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
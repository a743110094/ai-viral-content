import React, { useState } from 'react';
import { Copy, Check, Zap, TrendingUp, Eye, Target } from 'lucide-react';
import { ContentResults, PlatformContent } from '../services/contentGenerator';

interface ResultsViewProps {
  results: ContentResults;
  onRegenerate?: (platform: string) => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, onRegenerate }) => {
  const [activeTab, setActiveTab] = useState('pinterest');
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const platforms = [
    { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'from-red-500 to-pink-500' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-purple-500 to-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'from-blue-400 to-blue-600' },
    { id: 'youtube', name: 'YouTube', icon: '🎥', color: 'from-red-500 to-red-600' }
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, id]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CopyButton: React.FC<{ text: string; id: string }> = ({ text, id }) => (
    <button
      onClick={() => copyToClipboard(text, id)}
      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
    >
      {copiedItems.has(id) ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy
        </>
      )}
    </button>
  );

  const QualityScore: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-400';
      if (score >= 60) return 'text-yellow-400';
      return 'text-red-400';
    };

    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-blue-200 text-sm">Quality Score:</span>
          <span className={`font-semibold ${getScoreColor(score)}`}>{score}/100</span>
        </div>
      </div>
    );
  };

  const PlatformContent: React.FC<{ platform: string; content: PlatformContent }> = ({ platform, content }) => (
    <div className="space-y-6">
      {/* Quality Score */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <QualityScore score={content.qualityScore} />
      </div>

      {/* Viral Hooks */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Viral Hooks
          </h3>
        </div>
        <div className="space-y-3">
          {content.hooks.map((hook, index) => (
            <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
                      Hook #{index + 1}
                    </span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{hook}</p>
                </div>
                <CopyButton text={hook} id={`${platform}-hook-${index}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-400" />
            {platform === 'pinterest' ? 'Pinterest Description' : 
             platform === 'instagram' ? 'Instagram Script' :
             platform === 'twitter' ? 'Twitter Thread' : 'YouTube Script'}
          </h3>
          <CopyButton text={content.mainContent} id={`${platform}-main`} />
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
          <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {content.mainContent}
          </pre>
        </div>
      </div>

      {/* Hashtags */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Optimized Hashtags
          </h3>
          <CopyButton text={content.hashtags.join(' ')} id={`${platform}-hashtags`} />
        </div>
        <div className="flex flex-wrap gap-2">
          {content.hashtags.map((hashtag, index) => (
            <span
              key={index}
              className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
            >
              {hashtag}
            </span>
          ))}
        </div>
      </div>

      {/* A/B Headlines */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">A/B Test Headlines</h3>
        </div>
        <div className="space-y-3">
          {content.abHeadlines.map((headline, index) => (
            <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                      Variant {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{headline}</p>
                </div>
                <CopyButton text={headline} id={`${platform}-headline-${index}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Prompts */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">AI Image Prompts</h3>
        </div>
        <div className="space-y-3">
          {content.imagePrompts.map((prompt, index) => (
            <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                      Image #{index + 1}
                    </span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">{prompt}</p>
                </div>
                <CopyButton text={prompt} id={`${platform}-image-${index}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Analytics Overview */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-cyan-400" />
            Content Generation Results
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-lg">{results.analytics.overallQualityScore}/100</p>
                  <p className="text-blue-200 text-sm">Overall Quality Score</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-400 font-semibold text-lg">{Math.round(results.analytics.viralPotential)}/100</p>
                  <p className="text-blue-200 text-sm">Viral Potential</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-blue-400 font-semibold text-lg">{results.analytics.totalGenerationTime}ms</p>
                  <p className="text-blue-200 text-sm">Generation Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
          <div className="border-b border-slate-700">
            <div className="flex flex-wrap">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setActiveTab(platform.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-medium transition-all relative ${
                    activeTab === platform.id
                      ? 'text-white bg-slate-700/50'
                      : 'text-blue-200 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span>{platform.name}</span>
                  {activeTab === platform.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <PlatformContent 
              platform={activeTab} 
              content={results[activeTab as keyof Omit<ContentResults, 'analytics'>]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
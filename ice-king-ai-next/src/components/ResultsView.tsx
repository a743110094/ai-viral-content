'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Copy, 
  CheckCircle, 
  Instagram, 
  Twitter, 
  Youtube, 
  Image,
  Hash,
  FileText,
  Star,
  Clock,
  TrendingUp,
  ExternalLink,
  X,
  Camera
} from 'lucide-react';
import { ContentResults, PlatformType, PLATFORM_CONFIGS } from '@/types/content';

interface ResultsViewProps {
  results: ContentResults;
  onBack?: () => void;
  onRegenerate?: (platform: string) => void;
}

// Generate dynamic platform icons and colors from config
const getPlatformIcon = (platform: PlatformType) => {
  // For now, use existing icons as fallback, but we could enhance this
  // to use platform-specific icons from the config
  const iconMap = {
    pinterest: Image,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    wechat: Instagram, // fallback for new platforms
    weibo: Twitter,
    xiaohongshu: Instagram,
    tiktok: Youtube,
  };
  return iconMap[platform] || Image;
};

const getPlatformGradient = (platform: PlatformType) => {
  const colorMap = {
    pinterest: 'from-red-500 to-pink-500',
    instagram: 'from-purple-500 to-pink-500',
    twitter: 'from-blue-400 to-blue-600',
    youtube: 'from-red-600 to-red-700',
    wechat: 'from-green-500 to-green-600',
    weibo: 'from-orange-500 to-red-500',
    xiaohongshu: 'from-pink-500 to-red-400',
    tiktok: 'from-purple-600 to-pink-600',
  };
  return colorMap[platform] || 'from-gray-500 to-gray-600';
};

const ResultsView: React.FC<ResultsViewProps> = ({ results, onBack, onRegenerate }) => {
  const [activeTab, setActiveTab] = useState<keyof ContentResults>('pinterest');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');

  // Get available platforms (exclude analytics)
  const platforms = Object.keys(results).filter(key => key !== 'analytics') as Array<keyof ContentResults>;

  // Set active tab to first available platform when results change
  React.useEffect(() => {
    if (platforms.length > 0 && !platforms.includes(activeTab)) {
      setActiveTab(platforms[0]);
    }
  }, [platforms, activeTab]);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleGenerateImage = (prompt: string) => {
    setImagePrompt(prompt);
    setShowImageDialog(true);
  };

  const closeImageDialog = () => {
    setShowImageDialog(false);
    setImagePrompt('');
  };

  const renderPlatformContent = (platform: keyof ContentResults, data: any) => {
    // Add safety checks for data
    if (!data) {
      return (
        <div className="text-center text-slate-400 py-12">
          内容加载中...
        </div>
      );
    }

    const IconComponent = getPlatformIcon(platform as PlatformType);
    const gradientClass = getPlatformGradient(platform as PlatformType);
    
    return (
      <div className="space-y-6">
        {/* Platform Header */}
        <div className={`bg-gradient-to-r ${gradientClass} rounded-xl p-6 text-white`}>
          <div className="flex items-center gap-3 mb-4">
            <IconComponent className="w-6 h-6" />
            <h3 className="text-xl font-semibold">{PLATFORM_CONFIGS[platform as PlatformType]?.displayName || platform}</h3>
            <div className="ml-auto flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="font-medium">{data?.qualityScore || 75}/100</span>
            </div>
          </div>
          <p className="text-white/90">
            {PLATFORM_CONFIGS[platform as PlatformType]?.description || getPlatformDescription(platform)}
          </p>
        </div>

        {/* Hooks */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              开篇钩子 (5个)
            </h4>
            <button
              onClick={() => handleCopy(data.hooks.join('\n'), `hooks-${platform}`)}
              className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {copiedText === `hooks-${platform}` ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              复制
            </button>
          </div>
          <div className="space-y-3">
            {(data.hooks || []).map((hook: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-slate-900 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <p className="text-slate-200 flex-1">{hook}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              主要内容
            </h4>
            <button
              onClick={() => handleCopy(data.mainContent, `content-${platform}`)}
              className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {copiedText === `content-${platform}` ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              复制
            </button>
          </div>
          <div className="bg-slate-900/70 rounded-lg p-4">
            <pre className="text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
              {data.mainContent || '暂无内容'}
            </pre>
          </div>
        </div>

        {/* Hashtags */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Hash className="w-5 h-5 text-purple-400" />
              话题标签 (15个)
            </h4>
            <button
              onClick={() => handleCopy(data.hashtags.join(' '), `hashtags-${platform}`)}
              className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {copiedText === `hashtags-${platform}` ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              复制
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(data.hashtags || []).map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Image Prompts */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Image className="w-5 h-5 text-green-400" />
              视觉提示 (5个)
            </h4>
            <button
              onClick={() => handleCopy(data.imagePrompts.join('\n'), `images-${platform}`)}
              className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {copiedText === `images-${platform}` ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              复制
            </button>
          </div>
          <div className="space-y-3">
            {(data.imagePrompts || []).map((prompt: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-400 text-slate-900 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <p className="text-slate-200 flex-1">{prompt}</p>
                <button
                  onClick={() => handleGenerateImage(prompt)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm transition-all duration-200 border border-green-400/30 hover:border-green-400/50"
                >
                  <Camera className="w-3 h-3" />
                  生图
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* A/B Test Headlines */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400" />
              A/B测试标题 (3个)
            </h4>
            <button
              onClick={() => handleCopy(data.abHeadlines.join('\n'), `headlines-${platform}`)}
              className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              {copiedText === `headlines-${platform}` ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              复制
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(data.abHeadlines || []).map((headline: string, index: number) => (
              <div key={index} className="bg-slate-900/70 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-orange-400 text-slate-900 px-2 py-1 rounded-full font-semibold">
                    版本 {index + 1}
                  </span>
                </div>
                <p className="text-slate-200">{headline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getPlatformDescription = (platform: string): string => {
    const descriptions = {
      pinterest: '发现式内容，适合美妆、时尚、家居、生活方式类内容',
      instagram: '互动式内容，适合个人品牌、生活方式、教育内容',
      twitter: '观点性内容，适合商业洞察、技术分享、个人思考',
      youtube: '视频内容，适合教程、评测、故事分享',
    };
    return descriptions[platform as keyof typeof descriptions] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-blue-200 px-4 py-2 rounded-lg hover:text-white hover:border-slate-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            生成新内容
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">生成结果</h1>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.round(results.analytics.totalGenerationTime / 1000)}秒
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {results.analytics.overallQualityScore}/100分
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                病毒潜力: {Math.round(results.analytics.viralPotential)}%
              </div>
            </div>
          </div>

          <button
            onClick={() => onRegenerate?.('all')}
            className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-blue-200 px-4 py-2 rounded-lg hover:text-white hover:border-slate-600 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            重新生成
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/30 rounded-xl p-2">
          {platforms.map((platform) => {
            const IconComponent = getPlatformIcon(platform as PlatformType);
            const isActive = activeTab === platform;
            const platformConfig = PLATFORM_CONFIGS[platform as PlatformType];
            
            return (
              <button
                key={platform}
                onClick={() => setActiveTab(platform)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-white text-slate-900'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{platformConfig?.displayName || platform}</span>
                <span className="text-xs bg-slate-600 px-2 py-1 rounded-full">
                  {results[platform]?.qualityScore || 75}
                </span>
              </button>
            );
          })}
        </div>

        {/* Platform Content */}
        <div className="animate-fade-in-up">
          {renderPlatformContent(activeTab, results[activeTab])}
        </div>

        {/* Analytics Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-2">
              {Math.round(results.analytics.totalGenerationTime / 1000)}s
            </div>
            <div className="text-slate-300">生成时间</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-2">
              {results.analytics.overallQualityScore}/100
            </div>
            <div className="text-slate-300">整体质量</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-2">
              {Math.round(results.analytics.viralPotential)}%
            </div>
            <div className="text-slate-300">病毒潜力</div>
          </div>
        </div>
      </div>

      {/* 生图功能对话框 */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-400" />
                AI生图功能
              </h3>
              <button
                onClick={closeImageDialog}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-900/70 rounded-lg p-4">
                <p className="text-sm text-slate-300 mb-2">选中的提示词：</p>
                <p className="text-white text-sm">{imagePrompt}</p>
              </div>
              
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg text-yellow-300">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">此功能正在迭代中...</span>
                </div>
              </div>
              
              <p className="text-slate-400 text-sm text-center">
                此功能正在迭代中，请在 
                <span className="text-yellow-400 font-bold text-base mx-1 px-2 py-1 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
                  评论区
                </span>
                呼唤此功能，
                <br />
                我们将优先为您开放AI生图功能！
              </p>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeImageDialog}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  我知道了
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(imagePrompt);
                    closeImageDialog();
                  }}
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  复制提示词
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;
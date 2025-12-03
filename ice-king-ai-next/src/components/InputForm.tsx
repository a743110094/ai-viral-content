'use client';

import React, { useState } from 'react';
import { Zap, ArrowLeft, Smartphone, Brain, Image as ImageIcon, X } from 'lucide-react';
import { ContentInputs, PlatformType, PLATFORM_CONFIGS, DEFAULT_SELECTED_PLATFORMS } from '@/types/content';
import FunLoadingAnimation from './FunLoadingAnimation';
import SimpleAnalyzeLoading from './SimpleAnalyzeLoading';

interface InputFormProps {
  onGenerate: (inputs: ContentInputs) => Promise<void>;
  isLoading: boolean;
  onBack?: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading, onBack }) => {
  const [inputs, setInputs] = useState<ContentInputs>({
    niche: '',
    productLink: '',
    targetAudience: '',
    sellingPoints: '',
    tone: 'Professional',
    mainGoal: 'Grow Followers',
    selectedPlatforms: DEFAULT_SELECTED_PLATFORMS
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContentInputs, string>>>({});
  const [isAnalyzingAudience, setIsAnalyzingAudience] = useState(false);
  const [isAnalyzingSellingPoints, setIsAnalyzingSellingPoints] = useState(false);
  
  // 图片上传相关状态
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContentInputs, string>> = {};

    if (!inputs.niche?.trim()) {
      newErrors.niche = '请输入你的领域或话题';
    }

    if (!inputs.targetAudience?.trim()) {
      newErrors.targetAudience = '请输入目标受众';
    }

    if (!inputs.sellingPoints?.trim()) {
      newErrors.sellingPoints = '请输入产品卖点';
    }

    if (!inputs.selectedPlatforms || inputs.selectedPlatforms.length === 0) {
      newErrors.selectedPlatforms = '请至少选择一个平台';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlatformToggle = (platform: PlatformType) => {
    setInputs(prev => ({
      ...prev,
      selectedPlatforms: prev.selectedPlatforms?.includes(platform)
        ? prev.selectedPlatforms.filter(p => p !== platform)
        : [...(prev.selectedPlatforms || []), platform]
    }));
  };

  const handleSelectAllChinese = () => {
    setInputs(prev => ({
      ...prev,
      selectedPlatforms: ['wechat', 'weibo', 'xiaohongshu', 'douyin']
    }));
  };

  const handleSelectAllGlobal = () => {
    setInputs(prev => ({
      ...prev,
      selectedPlatforms: ['pinterest', 'instagram', 'twitter', 'youtube']
    }));
  };

  const handleSelectAll = () => {
    setInputs(prev => ({
      ...prev,
      selectedPlatforms: Object.keys(PLATFORM_CONFIGS) as PlatformType[]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // 将图片信息添加到 inputs 中
      const finalInputs = {
        ...inputs,
        uploadedImage: uploadedImage || undefined,
        imageDescription: inputs.imageDescription // 这个字段在图片分析时会被填充
      };
      await onGenerate(finalInputs);
    }
  };

  // 图片上传处理
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    setImageFile(file);
    
    // 转换为 base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      
      // 自动分析图片
      await analyzeImage(result);
    };
    reader.readAsDataURL(file);
  };

  // 删除图片
  const removeImage = () => {
    setUploadedImage('');
    setImageFile(null);
    // 清除图片描述
    handleInputChange('imageDescription', '');
  };

  // 分析图片
  const analyzeImage = async (imageData: string) => {
    if (!imageData) return;

    setIsAnalyzingImage(true);
    try {
      console.log('正在分析图片...');
      
      const response = await fetch('/api/image-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          config: {
            modelName: 'gpt-4-vision-preview',
            temperature: 0.7,
            maxTokens: 500
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '图片分析失败');
      }

      const data = await response.json();
      
      if (!data.success || !data.data?.description) {
        throw new Error(data.error?.message || '图片分析失败');
      }

      // 将图片描述添加到 inputs 中（隐藏字段）
      handleInputChange('imageDescription', data.data.description);
      
      console.log('图片分析完成:', data.data.description);
      
    } catch (error) {
      console.error('图片分析错误:', error);
      alert(`图片分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleInputChange = (field: keyof ContentInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAnalyzeAudience = async () => {
    if (!inputs.niche?.trim()) {
      setErrors(prev => ({ ...prev, niche: '请先填写领域/话题信息' }));
      return;
    }

    setIsAnalyzingAudience(true);
    try {
      console.log('正在分析目标受众...');
      
      const response = await fetch('/api/audience-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: inputs.niche,
          topic: '' // 可以后续扩展支持具体话题
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '分析失败');
      }

      const data = await response.json();
      
      if (!data.success || !data.data?.analysis) {
        throw new Error(data.error?.message || '分析失败');
      }

      // 自动填充目标受众字段
      setInputs(prev => ({ 
        ...prev, 
        targetAudience: data.data.analysis 
      }));
      
      // 清除错误信息
      if (errors.targetAudience) {
        setErrors(prev => ({ ...prev, targetAudience: undefined }));
      }

      console.log('受众分析完成:', data.data.analysis);
      
    } catch (error) {
      console.error('受众分析错误:', error);
      alert(`受众分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsAnalyzingAudience(false);
    }
  };

  const handleAnalyzeSellingPoints = async () => {
    if (!inputs.niche?.trim()) {
      setErrors(prev => ({ ...prev, niche: '请先填写领域/话题信息' }));
      return;
    }

    setIsAnalyzingSellingPoints(true);
    try {
      console.log('正在分析产品卖点...');
      
      const response = await fetch('/api/selling-points-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niche: inputs.niche,
          topic: '' // 可以后续扩展支持具体话题
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '分析失败');
      }

      const data = await response.json();
      
      if (!data.success || !data.data?.analysis) {
        throw new Error(data.error?.message || '分析失败');
      }

      // 自动填充卖点字段
      setInputs(prev => ({ 
        ...prev, 
        sellingPoints: data.data.analysis 
      }));
      
      // 清除错误信息
      if (errors.sellingPoints) {
        setErrors(prev => ({ ...prev, sellingPoints: undefined }));
      }

      console.log('卖点分析完成:', data.data.analysis);
      
    } catch (error) {
      console.error('卖点分析错误:', error);
      alert(`卖点分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsAnalyzingSellingPoints(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto py-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-7 h-7 text-yellow-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              内容生成配置
            </h1>
          </div>
          <p className="text-blue-200 text-base">
            将你的领域转化为全平台爆款内容
          </p>
        </div>

        {onBack && (
          <div className="mb-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-blue-200 px-3 py-1.5 rounded-lg hover:text-white hover:border-slate-600 transition-all text-sm"
            >
              <ArrowLeft className="w-3 h-3" />
              返回首页
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 shadow-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left: Input Area */}
            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-blue-200 mb-3">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    你的领域/话题 *
                  </span>
                </label>
                <textarea
                  value={inputs.niche}
                  onChange={(e) => handleInputChange('niche', e.target.value)}
                  placeholder="例如：忙碌妈妈的健身方案、企业家的AI生产力工具、大学生理财指南..."
                  className={`w-full h-24 bg-slate-900/70 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none text-base ${
                    errors.niche ? 'border-red-500' : 'border-slate-600'
                  }`}
                  disabled={isLoading}
                />
                {errors.niche && <p className="text-red-400 text-xs mt-1">{errors.niche}</p>}
              </div>


              {/* 图片上传区域 */}
              <div>
                <label className="block text-base font-medium text-blue-200 mb-3">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                    上传参考图片 (可选)
                  </span>
                </label>
                
                {!uploadedImage ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading || isAnalyzingImage}
                    />
                    <div className="w-full h-32 bg-slate-900/70 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-pointer">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm">点击或拖拽上传图片</span>
                      <span className="text-xs mt-1">支持 JPG、PNG、GIF 格式，最大5MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <img
                      src={uploadedImage}
                      alt="上传的图片"
                      className="w-full h-48 object-cover rounded-lg border border-slate-600"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                        disabled={isAnalyzingImage}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {isAnalyzingImage && (
                      <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <SimpleAnalyzeLoading className="mb-2" />
                          <p className="text-white text-sm">正在分析图片...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 隐藏的图片描述字段 */}
                <input
                  type="hidden"
                  name="imageDescription"
                  value={inputs.imageDescription || ''}
                  readOnly
                />
                
                {inputs.imageDescription && (
                  <div className="mt-2 p-2 bg-slate-800/50 rounded text-xs text-slate-400">
                    <span className="font-medium">图片已分析：</span>
                    <span className="ml-1">{inputs.imageDescription.substring(0, 100)}{inputs.imageDescription.length > 100 ? '...' : ''}</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-base font-medium text-blue-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                    目标受众 *
                  </label>
                  <button
                    type="button"
                    onClick={handleAnalyzeAudience}
                    disabled={isLoading || isAnalyzingAudience || !inputs.niche?.trim()}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:from-purple-400 hover:to-pink-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    title="智能分析目标受众"
                  >
                    {isAnalyzingAudience ? (
                      <SimpleAnalyzeLoading className="text-xs" />
                    ) : (
                      <>
                        <Brain className="w-3 h-3" />
                        智能分析
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={inputs.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="例如：25-40岁的时间管理困难职场妈妈、寻求工作流程自动化的科技企业家..."
                  className={`w-full h-28 bg-slate-900/70 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none text-base ${
                    errors.targetAudience ? 'border-red-500' : 'border-slate-600'
                  }`}
                  disabled={isLoading}
                />
                {errors.targetAudience && <p className="text-red-400 text-xs mt-1">{errors.targetAudience}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-base font-medium text-blue-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                    产品卖点/优势 *
                  </label>
                  <button
                    type="button"
                    onClick={handleAnalyzeSellingPoints}
                    disabled={isLoading || isAnalyzingSellingPoints || !inputs.niche?.trim()}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:from-yellow-400 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    title="智能分析产品卖点"
                  >
                    {isAnalyzingSellingPoints ? (
                      <SimpleAnalyzeLoading className="text-xs" />
                    ) : (
                      <>
                        <Brain className="w-3 h-3" />
                        智能分析
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  value={inputs.sellingPoints}
                  onChange={(e) => handleInputChange('sellingPoints', e.target.value)}
                  placeholder="例如：高效便捷，科学有效，性价比高，专业指导，安全可靠..."
                  className={`w-full h-28 bg-slate-900/70 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none text-base ${
                    errors.sellingPoints ? 'border-red-500' : 'border-slate-600'
                  }`}
                  disabled={isLoading}
                />
                {errors.sellingPoints && <p className="text-red-400 text-xs mt-1">{errors.sellingPoints}</p>}
              </div>

            </div>

            {/* Right: Platform Selection + Tone/Goal */}
            <div className="space-y-6">

              {/* 文案风格/调性和主要目标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    文案风格/调性
                  </label>
                  <select
                    value={inputs.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value as ContentInputs['tone'])}
                    className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-sm"
                    disabled={isLoading}
                  >
                    <option value="Professional">专业权威</option>
                    <option value="Humorous">幽默风趣</option>
                    <option value="Luxury">高端奢华</option>
                    <option value="Inspiring">励志激励</option>
                    <option value="Aggressive Marketing">强势营销</option>
                    <option value="Friendly Mentor">亲切导师</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    主要目标
                  </label>
                  <select
                    value={inputs.mainGoal}
                    onChange={(e) => handleInputChange('mainGoal', e.target.value as ContentInputs['mainGoal'])}
                    className="w-full bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-sm"
                    disabled={isLoading}
                  >
                    <option value="Grow Followers">涨粉引流</option>
                    <option value="Drive Affiliate Clicks">推广点击</option>
                    <option value="Sell Product">产品销售</option>
                    <option value="Build Brand Awareness">品牌曝光</option>
                  </select>
                </div>
              </div>

              {/* 产品/推广链接 */}
              <div>
                <label className="block text-base font-medium text-blue-200 mb-3">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                    产品/推广链接
                  </span>
                </label>
                <input
                  type="url"
                  value={inputs.productLink}
                  onChange={(e) => handleInputChange('productLink', e.target.value)}
                  placeholder="https://你的产品链接.com"
                  className={`w-full bg-slate-900/70 border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all text-base ${
                    errors.productLink ? 'border-red-500' : 'border-slate-600'
                  }`}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-green-400" />
                <label className="text-lg font-semibold text-white">
                  选择内容创作平台 *
                </label>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={handleSelectAllChinese}
                  className="px-3 py-1 bg-green-500/10 border border-green-400/30 text-green-300 rounded-lg hover:bg-green-500/20 hover:border-green-400/50 transition-all text-xs"
                  disabled={isLoading}
                >
                  🇨🇳 中国平台
                </button>
                <button
                  type="button"
                  onClick={handleSelectAllGlobal}
                  className="px-3 py-1 bg-blue-500/10 border border-blue-400/30 text-blue-300 rounded-lg hover:bg-blue-500/20 hover:border-blue-400/50 transition-all text-xs"
                  disabled={isLoading}
                >
                  🌍 国际平台
                </button>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3 py-1 bg-purple-500/10 border border-purple-400/30 text-purple-300 rounded-lg hover:bg-purple-500/20 hover:border-purple-400/50 transition-all text-xs"
                  disabled={isLoading}
                >
                  🌟 全选
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                {Object.entries(PLATFORM_CONFIGS).map(([platform, config]) => {
                  const isSelected = inputs.selectedPlatforms?.includes(platform as PlatformType);
                  
                  // 为每个平台定义品牌Logo和颜色
                  const platformBrands = {
                    wechat: {
                      logo: '💬',
                      brandColor: 'bg-green-500',
                      textColor: 'text-green-300',
                      bgColor: 'bg-green-500/10',
                      borderColor: 'border-green-400/30',
                      hoverBg: 'hover:bg-green-500/15'
                    },
                    weibo: {
                      logo: '📱',
                      brandColor: 'bg-red-500',
                      textColor: 'text-red-300',
                      bgColor: 'bg-red-500/10',
                      borderColor: 'border-red-400/30',
                      hoverBg: 'hover:bg-red-500/15'
                    },
                    xiaohongshu: {
                      logo: '📖',
                      brandColor: 'bg-pink-500',
                      textColor: 'text-pink-300',
                      bgColor: 'bg-pink-500/10',
                      borderColor: 'border-pink-400/30',
                      hoverBg: 'hover:bg-pink-500/15'
                    },
                    douyin: {
                      logo: '🎵',
                      brandColor: 'bg-black',
                      textColor: 'text-gray-300',
                      bgColor: 'bg-gray-500/10',
                      borderColor: 'border-gray-400/30',
                      hoverBg: 'hover:bg-gray-500/15'
                    },
                    pinterest: {
                      logo: '📌',
                      brandColor: 'bg-red-600',
                      textColor: 'text-red-300',
                      bgColor: 'bg-red-500/10',
                      borderColor: 'border-red-400/30',
                      hoverBg: 'hover:bg-red-500/15'
                    },
                    instagram: {
                      logo: '📷',
                      brandColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
                      textColor: 'text-purple-300',
                      bgColor: 'bg-purple-500/10',
                      borderColor: 'border-purple-400/30',
                      hoverBg: 'hover:bg-purple-500/15'
                    },
                    twitter: {
                      logo: '🐦',
                      brandColor: 'bg-blue-500',
                      textColor: 'text-blue-300',
                      bgColor: 'bg-blue-500/10',
                      borderColor: 'border-blue-400/30',
                      hoverBg: 'hover:bg-blue-500/15'
                    },
                    youtube: {
                      logo: '📺',
                      brandColor: 'bg-red-600',
                      textColor: 'text-red-300',
                      bgColor: 'bg-red-500/10',
                      borderColor: 'border-red-400/30',
                      hoverBg: 'hover:bg-red-500/15'
                    }
                  };

                  const brand = platformBrands[platform as keyof typeof platformBrands] || platformBrands.wechat;
                  
                  return (
                    <div
                      key={platform}
                      onClick={() => !isLoading && handlePlatformToggle(platform as PlatformType)}
                      className={`relative group cursor-pointer transition-all duration-200 ${
                        isSelected ? 'z-10' : 'hover:z-5'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className={`
                        ${brand.bgColor} ${brand.hoverBg} backdrop-blur-sm
                        ${brand.borderColor} hover:border-opacity-60
                        border-2 rounded-lg p-2 text-center shadow-md
                        transition-all duration-200 group-hover:shadow-lg
                        ${isSelected ? 'border-yellow-400 shadow-yellow-400/40 shadow-2xl bg-yellow-400/5' : ''}
                      `}>
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-yellow-900 text-xs font-bold">✓</span>
                          </div>
                        )}

                        {/* 平台Logo */}
                        <div className={`w-5 h-5 ${brand.brandColor} rounded-lg flex items-center justify-center text-white text-sm mb-1 mx-auto`}>
                          {brand.logo}
                        </div>

                        {/* 平台名称 */}
                        <h3 className={`font-semibold text-xs mb-0.5 ${brand.textColor}`}>
                          {config.displayName}
                        </h3>

                        {/* 简短描述 */}
                        <p className="text-[10px] text-slate-400 opacity-90 leading-tight">
                          {config.description.split('，')[0]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.selectedPlatforms && (
                <p className="text-red-400 text-xs mt-3">{errors.selectedPlatforms}</p>
              )}

              <div className="mt-4 p-3 bg-slate-800/70 backdrop-blur-sm rounded-lg border border-slate-600">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">已选择 {inputs.selectedPlatforms?.length || 0} 个平台：</span>
                  <span className="ml-1">
                    {inputs.selectedPlatforms?.map(platform =>
                      PLATFORM_CONFIGS[platform].displayName
                    ).join('、') || '请选择平台'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-semibold px-8 py-3 rounded-lg hover:from-yellow-300 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
            >
              {isLoading ? (
                <FunLoadingAnimation type="generate" />
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  生成爆款内容
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
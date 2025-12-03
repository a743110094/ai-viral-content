'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { ContentInputs } from '@/types/content';
import SimpleAnalyzeLoading from '../SimpleAnalyzeLoading';

interface Step1BasicInfoProps {
  data: Partial<ContentInputs>;
  onDataChange: (data: Partial<ContentInputs>) => void;
  isValidating?: boolean;
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ data, onDataChange, isValidating }) => {
  const [errors, setErrors] = React.useState<{ niche?: string }>({});
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validate = () => {
    const newErrors: { niche?: string } = {};
    
    if (!data.niche?.trim()) {
      newErrors.niche = '请输入你的领域或话题';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNicheChange = (value: string) => {
    onDataChange({ ...data, niche: value });
    if (errors.niche && value.trim()) {
      setErrors(prev => ({ ...prev, niche: undefined }));
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
    onDataChange({ ...data, imageDescription: '' });
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

      const result = await response.json();
      
      if (!result.success || !result.data?.description) {
        throw new Error(result.error?.message || '图片分析失败');
      }

      // 将图片描述添加到数据中
      onDataChange({ ...data, imageDescription: result.data.description });
      
      console.log('图片分析完成:', result.data.description);
      
    } catch (error) {
      console.error('图片分析错误:', error);
      alert(`图片分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // 领域示例
  const nicheExamples = [
    '忙碌妈妈的健身方案',
    '企业家的AI生产力工具',
    '大学生理财指南',
    '职场人士的时间管理',
    '美妆护肤技巧分享',
    '科技产品评测推荐'
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* 页面标题 - 美观的两行布局 */}
      <div className="flex items-start gap-5 mb-6">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-green-400 to-blue-500 rounded-xl shadow-2xl shadow-green-500/30 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <span className="text-2xl filter drop-shadow-sm">🎯</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          </div>
        </div>
        <div className="flex-1 pt-1">
          <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
            定义你的内容领域
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            告诉AI你的内容领域，上传参考图片帮助AI更好理解
          </p>
        </div>
      </div>

      {/* 功能区域分割线 */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-slate-900 px-3">
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 增加呼吸感 */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl flex-1 overflow-y-auto">
        {/* 领域/话题 - 主要输入区域 */}
        <div className="mb-6">
          <label className="block text-xl font-semibold text-white mb-3">
            <span className="flex items-center gap-3">
              <span className="w-3 h-3 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"></span>
              你的内容领域/话题是什么？ *
              <span className="text-sm text-slate-400 font-normal ml-3">💡 选择热门领域可快速填充</span>
            </span>
          </label>
          <div className="relative">
            <textarea
              value={data.niche || ''}
              onChange={(e) => handleNicheChange(e.target.value)}
              placeholder="例如：忙碌妈妈的健身方案、企业家的AI生产力工具、大学生理财指南..."
              className={`w-full h-24 bg-slate-900/50 border-2 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all resize-none text-lg ${
                errors.niche ? 'border-red-500' : 'border-slate-600'
              }`}
              disabled={isValidating}
            />
            <div className="absolute bottom-3 right-3 text-sm text-slate-500">
              {data.niche?.length || 0} / 200
            </div>
          </div>
          {errors.niche && (
            <div className="mt-3 flex items-center gap-2 text-red-400 text-base">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
              {errors.niche}
            </div>
          )}
          
          {/* 示例标签 - 增加间距 */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-3">
              {nicheExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleNicheChange(example)}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-full text-base text-slate-300 hover:bg-green-500/20 hover:border-green-400/50 hover:text-green-300 transition-all duration-200"
                  disabled={isValidating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 图片上传区域 - 增加呼吸感 */}
        <div className="border-t border-slate-800 pt-6">
          <label className="block text-lg font-medium text-blue-200 mb-3">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-orange-400" />
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
              上传参考图片（可选）
              <span className="text-sm text-slate-400 font-normal ml-3">AI将分析图片内容生成更精准文案</span>
            </span>
          </label>
          
          {!uploadedImage ? (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isValidating || isAnalyzingImage}
              />
              <div className="w-full h-24 bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-300 transition-all duration-300 cursor-pointer group">
                <ImageIcon className="w-6 h-6 mb-2 text-slate-400 group-hover:text-orange-300 transition-colors" />
                <span className="text-base font-medium">点击上传图片</span>
                <span className="text-sm mt-1">JPG、PNG、GIF，最大5MB</span>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <img
                src={uploadedImage}
                alt="上传的图片"
                className="w-full h-32 object-cover rounded-lg border border-slate-600 shadow"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-base font-medium transition-all duration-200 shadow"
                  disabled={isAnalyzingImage}
                >
                  <X className="w-4 h-4 inline mr-1" />
                  删除
                </button>
              </div>
              {isAnalyzingImage && (
                <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <SimpleAnalyzeLoading className="mb-2" />
                    <p className="text-white text-base">分析中...</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 隐藏的图片描述字段 */}
          <input
            type="hidden"
            name="imageDescription"
            value={data.imageDescription || ''}
            readOnly
          />
          
          {data.imageDescription && (
            <div className="mt-3 p-3 bg-slate-900/50 rounded text-base text-slate-400">
              <span className="font-medium">图片分析：</span>
              <span className="ml-2">{data.imageDescription.substring(0, 80)}{data.imageDescription.length > 80 ? '...' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
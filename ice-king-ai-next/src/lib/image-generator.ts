import OpenAI from 'openai';
import { ImageGeneration, ImageGenerationRequest, VisualPromptEnhancement } from '@/types/content';

// 获取自定义Base URL的函数
const getBaseURL = () => {
  return process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
};

// 生成请求ID的工具函数
const generateRequestId = () => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 生图配置验证
const validateImageConfig = (config: any) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('未配置OpenAI API密钥，请检查环境变量OPENAI_API_KEY是否已设置');
  }

  const provider = process.env.IMAGE_GENERATION_PROVIDER || 'OPENAI_DALL_E';
  
  if (provider === 'OPENAI_DALL_E') {
    const model = config?.modelName || process.env.DALLE_MODEL || 'dall-e-3';
    const size = config?.size || process.env.DALLE_SIZE || '1024x1024';
    const quality = config?.quality || process.env.DALLE_QUALITY || 'standard';
    
    // 验证DALL-E支持的质量和尺寸
    const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
    const validQualities = ['standard', 'hd'];
    
    if (!validSizes.includes(size)) {
      throw new Error(`不支持的图片尺寸: ${size}。支持的尺寸: ${validSizes.join(', ')}`);
    }
    
    if (!validQualities.includes(quality)) {
      throw new Error(`不支持的图片质量: ${quality}。支持的质量: ${validQualities.join(', ')}`);
    }
    
    if (model !== 'dall-e-3' && model !== 'dall-e-2') {
      console.warn(`使用的DALL-E模型 ${model} 可能不被支持，建议使用 'dall-e-3' 或 'dall-e-2'`); 
    }
  }
  
  return {
    provider,
    model: config?.modelName || process.env.DALLE_MODEL || 'dall-e-3',
    size: config?.size || process.env.DALLE_SIZE || '1024x1024',
    quality: config?.quality || process.env.DALLE_QUALITY || 'standard',
    temperature: config?.temperature || parseFloat(process.env.IMAGE_GENERATION_TEMPERATURE || '0.8'),
    n: config?.n || 1
  };
};

// 增强视觉提示词 - 包含详细的环境、前景、背景、色调描述
const enhanceVisualPrompt = (originalPrompt: string, platformType?: string): VisualPromptEnhancement => {
  // 基础视觉风格模板
  const baseEnvironmentStyles = {
    indoor: '室内环境',
    outdoor: '户外环境', 
    studio: '摄影棚环境',
    lifestyle: '生活方式环境',
    professional: '专业商务环境',
    natural: '自然环境'
  };

  const baseForegroundStyles = {
    portrait: '人物肖像为主',
    product: '产品展示为主',
    lifestyle: '生活场景为主',
    abstract: '抽象概念为主',
    action: '动作场景为主',
    food: '食物展示为主',
    fashion: '时尚展示为主'
  };

  const baseBackgroundStyles = {
    clean: '简洁干净背景',
    gradient: '渐变色彩背景',
    natural: '自然环境背景',
    urban: '都市环境背景',
    cozy: '温馨舒适背景',
    modern: '现代简约背景',
    textured: '质感纹理背景'
  };

  const baseColorSchemes = {
    warm: '温暖色调 - 金色、橙色、红色系，营造温馨氛围',
    cool: '清凉色调 - 蓝色、绿色、紫色系，营造清新感',
    vibrant: '鲜艳色调 - 高饱和度色彩，充满活力',
    muted: '柔和色调 - 低饱和度色彩，优雅低调',
    monochrome: '单色调 - 黑白灰为主，经典永恒',
    pastel: '粉彩色调 - 轻柔淡雅，少女感',
    dramatic: '戏剧色调 - 强烈对比，视觉冲击'
  };

  const baseLightingStyles = {
    natural: '自然光线 - 柔和均匀，真实自然',
    studio: '专业打光 - 均匀明亮，突出细节',
    golden_hour: '黄金时刻 - 温暖柔和，浪漫唯美',
    soft: '柔光 - 柔和散射，温馨舒适',
    dramatic: '戏剧性光影 - 强烈对比，神秘氛围',
    neon: '霓虹灯光 - 科技感强，炫酷现代'
  };

  const baseCompositionStyles = {
    centered: '居中构图 - 主体居中，平衡稳定',
    rule_of_thirds: '三分法则 - 黄金分割，视觉舒适',
    leading_lines: '引导线构图 - 视线引导，层次分明',
    frame_within_frame: '框中框 - 层次丰富，聚焦明确',
    symmetry: '对称构图 - 平衡美观，稳定感强',
    dynamic: '动态构图 - 动感的角度和布局'
  };

  // 根据平台类型调整风格
  const platformStyles: Record<string, VisualPromptEnhancement> = {
    instagram: {
      environment: `${baseEnvironmentStyles.lifestyle}，时尚现代的社交媒体风格`,
      foreground: `${baseForegroundStyles.lifestyle}，人物居中，清晰突出`,
      background: `${baseBackgroundStyles.clean}，简洁干净或渐变背景`,
      colorScheme: `${baseColorSchemes.vibrant}，饱和度适中，色调温暖`,
      mood: '活力四射，社交友好',
      style: 'ins风格，现代简约',
      lighting: `${baseLightingStyles.natural}，柔和明亮`,
      composition: `${baseCompositionStyles.centered}，居中构图，留有呼吸空间`
    },
    pinterest: {
      environment: `${baseEnvironmentStyles.lifestyle}，生活方式展示风格`,
      foreground: `${baseForegroundStyles.product}，产品或场景为主角`,
      background: `${baseBackgroundStyles.natural}，生活化场景背景`,
      colorScheme: `${baseColorSchemes.pastel}，清新自然，色调丰富`,
      mood: '温馨生活感',
      style: 'lifestyle风格，温馨治愈',
      lighting: `${baseLightingStyles.golden_hour}，自然光线，温暖舒适`,
      composition: `${baseCompositionStyles.rule_of_thirds}，场景化构图，展现生活方式`
    },
    xiaohongshu: {
      environment: `${baseEnvironmentStyles.indoor}，小红书种草风格`,
      foreground: `${baseForegroundStyles.product}，产品展示，使用场景`,
      background: `${baseBackgroundStyles.cozy}，生活化场景或纯色背景`,
      colorScheme: `${baseColorSchemes.warm}，清新色调，自然色彩`,
      mood: '真实自然，亲切生活',
      style: '种草风格，真实分享',
      lighting: `${baseLightingStyles.soft}，自然光线，生活化`,
      composition: `${baseCompositionStyles.centered}，产品展示为主，生活场景`
    },
    weibo: {
      environment: `${baseEnvironmentStyles.professional}，话题传播风格`,
      foreground: `${baseForegroundStyles.abstract}，话题焦点突出`,
      background: `${baseBackgroundStyles.clean}，简洁背景不抢夺主题`,
      colorScheme: `${baseColorSchemes.dramatic}，对比鲜明，视觉冲击`,
      mood: '话题性强，传播友好',
      style: '话题风格，简洁有力',
      lighting: `${baseLightingStyles.studio}，明亮清晰，突出主题`,
      composition: `${baseCompositionStyles.symmetry}，主题突出，简洁明了`
    },
    douyin: {
      environment: `${baseEnvironmentStyles.outdoor}，短视频截帧风格`,
      foreground: `${baseForegroundStyles.action}，动态感强，有冲击力`,
      background: `${baseBackgroundStyles.urban}，动态背景或场景化`,
      colorScheme: `${baseColorSchemes.vibrant}，高饱和度，对比强烈`,
      mood: '有趣动感，吸引眼球',
      style: '短视频风格，动态感强',
      lighting: `${baseLightingStyles.dramatic}，明亮有层次，视觉冲击`,
      composition: `${baseCompositionStyles.dynamic}，动态构图，视觉冲击`
    }
  };

  const defaultStyle: VisualPromptEnhancement = {
    environment: `${baseEnvironmentStyles.professional}，专业商务环境`,
    foreground: `${baseForegroundStyles.product}，主体清晰突出`,
    background: `${baseBackgroundStyles.clean}，简洁专业背景`,
    colorScheme: `${baseColorSchemes.cool}，商务色调，专业稳重`,
    mood: '专业可信',
    style: '商务风格，简洁专业',
    lighting: `${baseLightingStyles.studio}，均匀明亮，专业感强`,
    composition: `${baseCompositionStyles.centered}，居中构图，专业布局`
  };

  const style = platformStyles[platformType || ''] || defaultStyle;

  return {
    ...style,
    // 基于原始提示词进行增强，确保包含核心描述要素
    environment: `${style.environment}，专门为${originalPrompt}设计的主题场景`,
    foreground: `${style.foreground}，${originalPrompt}作为视觉焦点`,
    background: `${style.background}，营造${style.mood}的整体氛围`,
    colorScheme: `${style.colorScheme}，特别突出${originalPrompt}的核心视觉元素`,
    style: `${style.style}，完美展现${originalPrompt}的特质`,
    lighting: `${style.lighting}，为${originalPrompt}创造最佳的视觉呈现效果`,
    composition: `${style.composition}，确保${originalPrompt}得到完美展现`
  };
};

// 将增强的视觉描述转换为英文提示词
const buildEnhancedPrompt = (originalPrompt: string, enhancement: VisualPromptEnhancement): string => {
  const enhancedPrompt = `Professional ${enhancement.style} image featuring ${enhancement.foreground}. 

Environment: ${enhancement.environment}
Background: ${enhancement.background}
Color scheme: ${enhancement.colorScheme} with vibrant yet balanced tones
Mood and atmosphere: ${enhancement.mood}
Lighting: ${enhancement.lighting}
Composition: ${enhancement.composition}

Main subject: ${originalPrompt}

Technical requirements: High quality, professional photography style, sharp focus, balanced exposure, suitable for social media marketing content.`;

  return enhancedPrompt;
};

// 生图主类
export class ImageGenerator {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OPENAI_API_KEY is not set. Image generation will not work without API key.');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: getBaseURL(),
    });

    console.log(`🎨 Image Generator initialized`);
    console.log(`🤖 Provider: ${process.env.IMAGE_GENERATION_PROVIDER || 'OPENAI_DALL_E'}`);
    console.log(`🌐 API URL: ${getBaseURL()}`);
    console.log(`🔑 API Key: ${process.env.OPENAI_API_KEY ? '已配置' : '未配置'}`);
  }

  async generateImages(request: ImageGenerationRequest): Promise<ImageGeneration[]> {
    const config = validateImageConfig(request.config);
    const requestId = request.requestId || generateRequestId();
    
    console.log(`\n🎨 ========== 开始生图任务 ==========`);
    console.log(`📝 请求ID: ${requestId}`);
    console.log(`📋 请求参数:`, {
      promptCount: request.prompts.length,
      platforms: request.selectedPlatforms,
      model: config.model,
      size: config.size,
      quality: config.quality
    });

    const results: ImageGeneration[] = [];
    const startTime = Date.now();

    try {
      // 为每个提示词生成图片
      for (let i = 0; i < request.prompts.length; i++) {
        const prompt = request.prompts[i];
        console.log(`\n📸 生成第 ${i + 1}/${request.prompts.length} 张图片: "${prompt.substring(0, 50)}..."`);
        
        try {
          // 增强视觉提示词
          const platform = request.selectedPlatforms[0]; // 使用第一个平台作为参考
          const enhancement = enhanceVisualPrompt(prompt, platform);
          const enhancedPrompt = buildEnhancedPrompt(prompt, enhancement);
          
          console.log(`🔧 原始提示词: ${prompt}`);
          console.log(`🔧 增强提示词: ${enhancedPrompt.substring(0, 100)}...`);

          const imageStartTime = Date.now();
          let imageUrl = '';
          let modelUsed = config.model;
          let providerUsed = config.provider || 'OPENAI_DALL_E';

          // 根据提供商选择不同的API
          if (providerUsed === 'OPENAI_DALL_E') {
            const response = await this.openai.images.generate({
              model: config.model,
              prompt: enhancedPrompt,
              size: config.size as any,
              quality: config.quality as any,
              n: config.n,
            });

            if (response.data && response.data.length > 0) {
              imageUrl = response.data[0].url || '';
            }
          } else {
            throw new Error(`暂不支持的图像生成提供商: ${providerUsed}`);
          }

          const imageEndTime = Date.now();
          const generationTime = imageEndTime - imageStartTime;

          if (!imageUrl) {
            throw new Error('AI返回的图片URL为空');
          }

          const imageGeneration: ImageGeneration = {
            id: `${requestId}_${i}`,
            prompt: prompt,
            imageUrl: imageUrl,
            model: modelUsed,
            provider: providerUsed,
            size: config.size,
            quality: config.quality,
            generationTime: generationTime,
            parameters: {
              temperature: config.temperature,
              n: config.n
            },
            status: 'success'
          };

          results.push(imageGeneration);
          console.log(`✅ 第 ${i + 1} 张图片生成成功!`);
          console.log(`⏱️  耗时: ${generationTime}ms`);

        } catch (error) {
          console.error(`❌ 第 ${i + 1} 张图片生成失败:`, error);
          
          const failedImage: ImageGeneration = {
            id: `${requestId}_${i}`,
            prompt: prompt,
            imageUrl: '',
            model: config.model,
            provider: config.provider || 'OPENAI_DALL_E',
            size: config.size,
            quality: config.quality,
            generationTime: 0,
            parameters: {
              temperature: config.temperature,
              n: config.n
            },
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : '未知错误'
          };
          
          results.push(failedImage);
        }
      }

      const totalTime = Date.now() - startTime;
      const successCount = results.filter(r => r.status === 'success').length;
      const failedCount = results.filter(r => r.status === 'failed').length;
      
      console.log(`\n🎉 ========== 生图任务完成 ==========`);
      console.log(`⏱️  总耗时: ${totalTime}ms`);
      console.log(`📊 统计结果: 成功 ${successCount} 张，失败 ${failedCount} 张`);
      console.log(`🚀 ========== 生图任务完成 ==========\n`);

      return results;

    } catch (error) {
      console.error(`\n❌ 生图任务失败:`, error);
      throw new Error(`图像生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  // 检查配置是否有效
  async validateConfig(): Promise<{ valid: boolean; error?: string }> {
    try {
      validateImageConfig({});
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : '配置验证失败' 
      };
    }
  }

  // 获取支持的模型列表
  getSupportedModels(): Array<{ provider: string; model: string; displayName: string }> {
    return [
      {
        provider: 'OPENAI_DALL_E',
        model: 'dall-e-3',
        displayName: 'DALL-E 3 (OpenAI官方)'
      },
      {
        provider: 'OPENAI_DALL_E', 
        model: 'dall-e-2',
        displayName: 'DALL-E 2 (OpenAI官方)'
      }
    ];
  }

  // 获取支持的图片尺寸
  getSupportedSizes(): string[] {
    return ['1024x1024', '1792x1024', '1024x1792'];
  }
}

// 导出单例实例
export const imageGenerator = new ImageGenerator();
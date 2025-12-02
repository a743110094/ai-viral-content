import OpenAI from 'openai';
import { ContentInputs, PlatformContent, PlatformType } from '@/types/content';

// 获取自定义Base URL（支持OpenAI协议兼容的API）
const getBaseURL = () => {
  return process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
};

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set. Please set it in your environment variables.');
}

console.log(`🤖 使用API基础地址: ${getBaseURL()}`);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: getBaseURL(), // 支持自定义Base URL
});

export class OpenAIContentGenerator {
  private readonly model = process.env.OPENAI_MODEL || 'gpt-4';
  private readonly maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS || '2000');
  private readonly temperature = parseFloat(process.env.OPENAI_TEMPERATURE || '0.8');

  constructor() {
    console.log(`🤖 AI内容生成器初始化`);
    console.log(`📡 模型: ${this.model}`);
    console.log(`🎯 温度: ${this.temperature}`);
    console.log(`💬 最大Token: ${this.maxTokens}`);
    console.log(`🌐 API地址: ${getBaseURL()}`);
    console.log(`🔑 API密钥: ${process.env.OPENAI_API_KEY ? '已配置' : '未配置'}`);
  }

  async generateContent(
    inputs: ContentInputs,
    platform: PlatformType,
    forceApiCall: boolean = false
  ): Promise<PlatformContent> {
    const prompt = this.buildPrompt(platform, inputs);
    
    console.log(`\n🚀 ========== 开始为${this.getPlatformDisplayName(platform)}平台生成内容 ==========`);
    console.log(`📝 输入参数:`, {
      niche: inputs.niche,
      targetAudience: inputs.targetAudience,
      sellingPoints: inputs.sellingPoints,
      tone: inputs.tone,
      mainGoal: inputs.mainGoal,
      productLink: inputs.productLink || '未提供'
    });
    
    if (forceApiCall) {
      console.log(`⚠️  强制API调用模式: 跳过缓存，直接调用AI服务`);
    }
    
    try {
      console.log(`🔄 正在调用 ${getBaseURL()}/chat/completions...`);
      console.log(`📋 请求详情:`);
      console.log(`   - 模型: ${this.model}`);
      console.log(`   - 温度: ${this.temperature}`);
      console.log(`   - 最大Token: ${this.maxTokens}`);
      
      const startTime = Date.now();
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `你是一位专业的${this.getPlatformDisplayName(platform)}内容营销专家，擅长创建病毒式传播的内容。请严格按照JSON格式返回内容。`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`\n✅ ${this.getPlatformDisplayName(platform)}内容生成成功!`);
      console.log(`⏱️  耗时: ${duration}ms`);
      console.log(`📊 API响应详情:`);
      console.log(`   - 模型: ${completion.model}`);
      console.log(`   - Token使用:`, completion.usage);
      console.log(`   - 完成原因: ${completion.choices[0]?.finish_reason}`);
      console.log(`   - 生成内容长度: ${completion.choices[0]?.message?.content?.length || 0} 字符`);
      console.log(`🚀 ========== ${this.getPlatformDisplayName(platform)}生成完成 ==========\n`);

      const choice = completion.choices[0];
      const generatedText = choice?.message?.content || '';
      
      console.log(`🔍 内容提取详情:`, {
        hasChoice: !!choice,
        hasMessage: !!choice?.message,
        hasContent: !!choice?.message?.content,
        contentLength: choice?.message?.content?.length || 0,
        contentPreview: choice?.message?.content?.substring(0, 200) || '空',
        finishReason: choice?.finish_reason
      });

      if (!generatedText) {
        const errorMsg = choice?.finish_reason === 'length' 
          ? 'AI返回内容被截断，请重试或联系管理员调整参数'
          : 'API返回内容为空';
        throw new Error(errorMsg);
      }
      
      console.log(`📄 生成的原始内容预览:`);
      console.log(`---START---`);
      console.log(generatedText.substring(0, 200) + (generatedText.length > 200 ? '...' : ''));
      console.log(`---END---`);
      
      return this.parseGeneratedContent(generatedText, platform);
    } catch (error) {
      console.error(`\n❌ OpenAI API错误 for ${platform}:`, error);
      console.error(`🔍 错误详情:`, {
        message: error instanceof Error ? error.message : '未知错误',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // 更详细的错误信息
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error(`API密钥无效或已过期，请检查OPENAI_API_KEY配置`);
        } else if (error.message.includes('429')) {
          throw new Error(`API调用频率超限，请稍后重试`);
        } else if (error.message.includes('400')) {
          throw new Error(`请求参数错误，请检查输入内容`);
        } else if (error.message.includes('503')) {
          throw new Error(`API服务暂时不可用，请稍后重试`);
        } else if (error.message.includes('fetch')) {
          throw new Error(`网络连接失败，请检查网络连接和API地址`);
        }
      }
      
      throw new Error(`${this.getPlatformDisplayName(platform)}内容生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  private getPlatformDisplayName(platform: PlatformType): string {
    const names = {
      pinterest: 'Pinterest',
      instagram: 'Instagram',
      twitter: 'Twitter/X',
      youtube: 'YouTube',
      wechat: '微信',
      weibo: '微博',
      xiaohongshu: '小红书',
      douyin: '抖音'
    };
    return names[platform] || platform;
  }

  private buildPrompt(platform: PlatformType, inputs: ContentInputs): string {
    const basePrompt = `
请基于以下信息为${this.getPlatformDisplayName(platform)}平台生成专业营销内容：

领域/话题: ${inputs.niche}
目标受众: ${inputs.targetAudience}
产品卖点: ${inputs.sellingPoints}
文案风格: ${inputs.tone}
营销目标: ${inputs.mainGoal}
产品链接: ${inputs.productLink}

请严格按照以下JSON格式返回内容，不要包含任何其他文字：

{
  "hooks": ["钩子1", "钩子2", "钩子3", "钩子4", "钩子5"],
  "mainContent": "主要内容文案",
  "hashtags": ["标签1", "标签2", "标签3", "标签4", "标签5", "标签6", "标签7", "标签8", "标签9", "标签10", "标签11", "标签12", "标签13", "标签14", "标签15"],
  "imagePrompts": ["图片提示1", "图片提示2", "图片提示3", "图片提示4", "图片提示5"],
  "abHeadlines": ["标题1", "标题2", "标题3"],
  "qualityScore": 85
}

要求：
`;

    const platformSpecific = {
      pinterest: `- 符合Pinterest的发现式浏览特点
- 标题要有视觉冲击力
- 内容要有实用价值
- 标签要精准且热门`,
      
      instagram: `- 适合Instagram Reels格式
- 注重视觉表现力
- 包含互动元素
- 标签组合要有策略性`,
      
      twitter: `- 简洁有力，适合快速消费
- 可以包含观点和态度
- 符合字符限制
- 具有讨论价值`,
      
      youtube: `- 包含详细的时间轴
- 适合视频制作
- 有观看吸引力
- 包含行动号召`,
      
      // 中国平台特色
      wechat: `- 适合微信公众号图文发布
- 内容要有深度和价值
- 排版美观，包含图文混排
- 结尾要有明确的行动号召
- 标题要有吸引力但不夸张`,
      
      weibo: `- 适合微博140字内容发布
- 可以使用表情符号增加趣味性
- 包含话题标签（#话题#）
- 内容要有传播性和互动性
- 可以适当加入热点话题`,
      
      xiaohongshu: `- 符合小红书种草特色
- 内容要真实、有价值
- 排版美观，图文并重
- 包含实用的标签和关键词
- 风格要贴近生活，有亲和力`,
      
      douyin: `- 适合抖音短视频创作
- 内容要有趣、节奏感强
- 开头3秒要有吸引力
- 包含互动性元素
- 话题标签要有热度`
    };

    return basePrompt + (platformSpecific[platform] || platformSpecific['wechat'] || '');
  }

  private parseGeneratedContent(text: string, platform: PlatformType): PlatformContent {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法从响应中提取JSON内容');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and provide defaults
      return {
        hooks: Array.isArray(parsed.hooks) ? parsed.hooks.slice(0, 5) : [`关于${platform}的精彩内容`],
        mainContent: typeof parsed.mainContent === 'string' ? parsed.mainContent : '生成的内容暂时不可用',
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.slice(0, 15) : ['#content', '#marketing'],
        imagePrompts: Array.isArray(parsed.imagePrompts) ? parsed.imagePrompts.slice(0, 5) : ['专业的营销视觉设计'],
        abHeadlines: Array.isArray(parsed.abHeadlines) ? parsed.abHeadlines.slice(0, 3) : ['默认标题'],
        qualityScore: typeof parsed.qualityScore === 'number' ? parsed.qualityScore : 75,
      };
    } catch (error) {
      console.error(`Failed to parse ${platform} content:`, error);
      // Return fallback content
      return {
        hooks: [`${this.getPlatformDisplayName(platform)}内容创作专家为您精心准备`],
        mainContent: 'AI正在为您生成专业的营销内容，请稍后查看更新。',
        hashtags: ['#AI营销', '#内容创作', '#数字营销'],
        imagePrompts: ['专业的数字营销视觉设计'],
        abHeadlines: [`${this.getPlatformDisplayName(platform)}营销方案`],
        qualityScore: 60,
      };
    }
  }
}

// Export singleton instance
export const openAIGenerator = new OpenAIContentGenerator();
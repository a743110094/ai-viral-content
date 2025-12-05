// Content Generation Types for Ice King AI

// 支持的所有平台类型
export type PlatformType = 
  | 'pinterest' | 'instagram' | 'twitter' | 'youtube'  // 国外平台
  | 'wechat' | 'weibo' | 'xiaohongshu' | 'douyin';      // 中国平台

// 生图相关类型
export interface ImageGeneration {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  provider: string;
  size: string;
  quality: string;
  generationTime: number;
  parameters: {
    temperature: number;
    n: number;
  };
  status: 'success' | 'failed';
  errorMessage?: string;
}

export interface ImageGenerationRequest {
  prompts: string[];
  selectedPlatforms: PlatformType[];
  config?: {
    modelName?: string;
    size?: string;
    quality?: string;
    temperature?: number;
    n?: number;
  };
  requestId?: string;
}

export interface VisualPromptEnhancement {
  environment: string;
  foreground: string;
  background: string;
  colorScheme: string;
  mood: string;
  style: string;
  lighting: string;
  composition: string;
}

// 平台配置信息
export interface PlatformConfig {
  name: PlatformType;
  displayName: string;
  icon: string;
  description: string;
  maxContentLength: number;
  hashtagLimit: number;
  features: string[];
}

export interface ContentInputs {
  niche: string;
  productLink: string;
  targetAudience: string;
  sellingPoints: string; // 新增：产品卖点/优势
  tone: 'Professional' | 'Humorous' | 'Luxury' | 'Inspiring' | 'Aggressive Marketing' | 'Friendly Mentor';
  mainGoal: 'Grow Followers' | 'Drive Affiliate Clicks' | 'Sell Product' | 'Build Brand Awareness';
  // 新增：选择要生成内容的平台
  selectedPlatforms: PlatformType[];
  // 新增：图片上传相关字段
  uploadedImage?: string; // Base64编码的图片数据
  imageDescription?: string; // AI生成的图片描述，对用户不可见
}

export interface PlatformContent {
  hooks: string[];
  mainContent: string;
  hashtags: string[];
  imagePrompts: string[];
  abHeadlines: string[];
  qualityScore: number;
}

export interface ContentResults {
  // 使用动态平台键值对，只包含用户选择的平台
  [platform: string]: PlatformContent | any;
  analytics: {
    totalGenerationTime: number;
    overallQualityScore: number;
    viralPotential: number;
    generatedPlatforms: PlatformType[];  // 记录实际生成的平台
  };
}

// 默认选中的平台列表
export const DEFAULT_SELECTED_PLATFORMS: PlatformType[] = [
  'pinterest', 'instagram', 'twitter', 'youtube'
];

// 所有平台配置
export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  // 国外平台
  pinterest: {
    name: 'pinterest',
    displayName: 'Pinterest',
    icon: '📌',
    description: '发现式内容，适合美妆、时尚、家居、生活方式类内容',
    maxContentLength: 500,
    hashtagLimit: 15,
    features: ['发现式浏览', '视觉导向', '收藏功能']
  },
  instagram: {
    name: 'instagram',
    displayName: 'Instagram',
    icon: '📸',
    description: '互动式内容，适合个人品牌、生活方式、教育内容',
    maxContentLength: 2200,
    hashtagLimit: 30,
    features: ['Reels视频', 'Stories', 'IGTV', '购物功能']
  },
  twitter: {
    name: 'twitter',
    displayName: 'Twitter',
    icon: '🐦',
    description: '观点性内容，适合商业洞察、技术分享、个人思考',
    maxContentLength: 280,
    hashtagLimit: 10,
    features: ['实时性', '话题讨论', '转发传播']
  },
  youtube: {
    name: 'youtube',
    displayName: 'YouTube',
    icon: '🎥',
    description: '视频内容，适合教程、评测、故事分享',
    maxContentLength: 5000,
    hashtagLimit: 15,
    features: ['长视频', 'Shorts', '直播', '会员功能']
  },
  // 中国平台
  wechat: {
    name: 'wechat',
    displayName: '微信',
    icon: '💬',
    description: '社交化内容，适合私域运营、深度交流',
    maxContentLength: 2000,
    hashtagLimit: 10,
    features: ['朋友圈', '公众号', '私域流量', '微信群']
  },
  weibo: {
    name: 'weibo',
    displayName: '微博',
    icon: '📢',
    description: '热点化内容，适合话题传播、明星效应',
    maxContentLength: 140,
    hashtagLimit: 20,
    features: ['热搜榜', '话题标签', '转发评论', '明星效应']
  },
  xiaohongshu: {
    name: 'xiaohongshu',
    displayName: '小红书',
    icon: '📖',
    description: '种草化内容，适合产品推荐、生活分享、美妆时尚',
    maxContentLength: 1000,
    hashtagLimit: 20,
    features: ['图文种草', '视频分享', '购物链接', '女性用户']
  },
  douyin: {
    name: 'douyin',
    displayName: '抖音',
    icon: '🎵',
    description: '短视频内容，适合娱乐搞笑、技能展示、直播带货',
    maxContentLength: 150,
    hashtagLimit: 10,
    features: ['短视频', '直播', '电商带货', '算法推荐']
  }
};

// API Request/Response Types
export interface GenerateContentRequest {
  inputs: ContentInputs;
  config?: {
    modelProvider?: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
    enableCache?: boolean;
    language?: string;
    forceApiCall?: boolean; // 强制调用API，跳过缓存
  };
  requestId?: string;
}

export interface GenerateContentResponse {
  success: boolean;
  data?: ContentResults;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    requestId: string;
    generatedAt: string;
    modelInfo: {
      provider: string;
      model: string;
      version: string;
    };
    cached?: boolean;
  };
}

// LLM Provider Types
export interface LLMProvider {
  name: string;
  displayName: string;
  models: {
    name: string;
    displayName: string;
    maxTokens: number;
    costPer1kTokens: {
      input: number;
      output: number;
    };
    capabilities: string[];
  }[];
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export interface GenerationMetrics {
  totalGenerationTime: number;
  apiCallsCount: number;
  tokensUsed: {
    input: number;
    output: number;
  };
  cost: number;
  cacheHitRate: number;
}
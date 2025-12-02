import { ContentInputs, ContentResults, PlatformType, PLATFORM_CONFIGS, DEFAULT_SELECTED_PLATFORMS } from '@/types/content';
import { openAIGenerator } from './openai';
import { cache } from './cache';
import { calculateQualityScore } from './utils';

export class ContentGenerator {
  private startTime: number = 0;

  async generateContent(inputs: ContentInputs, forceApiCall: boolean = false): Promise<ContentResults> {
    this.startTime = Date.now();
    
    console.log(`\n🔥 ========== 开始AI内容生成 ==========`);
    console.log(`📋 请求参数:`, inputs);
    if (forceApiCall) {
      console.log(`⚠️  强制API调用模式: 将忽略缓存，强制调用AI服务`);
    }
    console.log(`🔥 ========== ========== ==========\n`);
    
    try {
      // Generate cache key
      const cacheKey = cache.generateContentCacheKey(inputs);
      
      // Check cache first (unless forceApiCall is true)
      if (!forceApiCall) {
        const cached = await cache.get<ContentResults>(cacheKey);
        if (cached) {
          console.log(`💾 缓存命中! 返回缓存结果 (${cacheKey})`);
          console.log(`⏱️  缓存响应时间: ${Date.now() - this.startTime}ms`);
          return {
            ...cached,
            analytics: {
              ...cached.analytics,
              totalGenerationTime: Date.now() - this.startTime,
            }
          };
        }
      } else {
        console.log(`🔄 强制API模式: 跳过缓存检查`);
      }

      // Get selected platforms (default to all Chinese platforms)
      const selectedPlatforms = inputs.selectedPlatforms || DEFAULT_SELECTED_PLATFORMS;
      console.log(`🎯 选择生成平台: ${selectedPlatforms.join(', ')}`);

      // Validate selected platforms
      const validPlatforms = selectedPlatforms.filter(platform => PLATFORM_CONFIGS[platform]);
      if (validPlatforms.length === 0) {
        throw new Error('未选择有效的平台');
      }

      if (validPlatforms.length !== selectedPlatforms.length) {
        console.warn(`⚠️  过滤后的有效平台: ${validPlatforms.join(', ')}`);
      }

      // Generate content for selected platforms in parallel
      console.log(`🚀 开始为 ${validPlatforms.length} 个平台并行生成内容...`);
      const platformPromises = validPlatforms.map(async (platform) => {
        const content = await openAIGenerator.generateContent(inputs, platform, forceApiCall);
        return { platform, content };
      });

      const platformResults = await Promise.all(platformPromises);
      const generationTime = Date.now() - this.startTime;

      // Build results object dynamically
      const results: ContentResults = {
        analytics: {
          totalGenerationTime: generationTime,
          overallQualityScore: 0,
          viralPotential: 0,
        },
      };

      let totalQualityScore = 0;
      let validContentCount = 0;

      platformResults.forEach(({ platform, content }) => {
        if (content && content.mainContent) {
          const qualityScore = calculateQualityScore(content.mainContent, platform);
          totalQualityScore += qualityScore;
          validContentCount++;

          results[platform] = {
            ...content,
            qualityScore
          };
        }
      });

      // Calculate overall metrics
      if (validContentCount > 0) {
        results.analytics.overallQualityScore = Math.round(totalQualityScore / validContentCount);
        results.analytics.viralPotential = Math.min(
          results.analytics.overallQualityScore + Math.random() * 20, 
          100
        );
      }

      // Cache the results (unless forceApiCall is true)
      if (!forceApiCall) {
        await cache.set(cacheKey, results, 3600); // Cache for 1 hour
        console.log(`💾 结果已缓存 (${cacheKey})`);
      } else {
        console.log(`⚠️  强制API模式: 跳过缓存存储`);
      }

      console.log(`✅ 内容生成完成! 总耗时: ${generationTime}ms`);
      return results;

    } catch (error) {
      console.error(`❌ 内容生成失败:`, error);
      throw new Error('内容生成服务暂时不可用，请稍后重试');
    }
  }

  // Validate input parameters
  validateInputs(inputs: ContentInputs): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!inputs.niche?.trim()) {
      errors.push('领域/话题不能为空');
    }

    if (!inputs.targetAudience?.trim()) {
      errors.push('目标受众不能为空');
    }

    if (inputs.productLink && !this.isValidUrl(inputs.productLink)) {
      errors.push('产品链接格式不正确');
    }

    if (!this.isValidTone(inputs.tone)) {
      errors.push('文案风格参数不正确');
    }

    if (!this.isValidGoal(inputs.mainGoal)) {
      errors.push('营销目标参数不正确');
    }

    // Validate selected platforms
    if (inputs.selectedPlatforms && Array.isArray(inputs.selectedPlatforms)) {
      const invalidPlatforms = inputs.selectedPlatforms.filter(
        platform => !PLATFORM_CONFIGS[platform]
      );
      if (invalidPlatforms.length > 0) {
        errors.push(`无效的平台类型: ${invalidPlatforms.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidTone(tone: string): boolean {
    const validTones = [
      'Professional', 
      'Humorous', 
      'Luxury', 
      'Inspiring', 
      'Aggressive Marketing', 
      'Friendly Mentor'
    ];
    return validTones.includes(tone);
  }

  private isValidGoal(goal: string): boolean {
    const validGoals = [
      'Grow Followers', 
      'Drive Affiliate Clicks', 
      'Sell Product', 
      'Build Brand Awareness'
    ];
    return validGoals.includes(goal);
  }

  // Generate content for a specific platform (for debugging)
  async generatePlatformContent(
    inputs: ContentInputs, 
    platform: PlatformType
  ): Promise<any> {
    const cacheKey = `platform:${platform}:${cache.generateContentCacheKey(inputs)}`;
    
    const cached = await cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const content = await openAIGenerator.generateContent(inputs, platform);
    await cache.set(cacheKey, content, 1800); // Cache for 30 minutes

    return content;
  }
}

// Export singleton instance
export const contentGenerator = new ContentGenerator();
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 模拟受众分析函数
function generateMockAudienceAnalysis(niche: string): string {
  const nicheLower = niche.toLowerCase();
  
  // 基于关键词的简单规则匹配
  if (nicheLower.includes('妈妈') || nicheLower.includes('母亲') || nicheLower.includes('育儿')) {
    return '25-40岁的职场妈妈和新手妈妈，注重家庭健康和孩子教育，追求工作与家庭平衡的都市女性。';
  } else if (nicheLower.includes('健身') || nicheLower.includes('运动') || nicheLower.includes('减肥')) {
    return '20-35岁的健康意识强的都市白领和年轻妈妈，追求身材管理和健康生活方式，注重科学的健身方法。';
  } else if (nicheLower.includes('理财') || nicheLower.includes('投资') || nicheLower.includes('财富')) {
    return '25-45岁的有一定收入基础的职场人士和企业主，希望通过理财实现财富增值，关注投资理财知识。';
  } else if (nicheLower.includes('职场') || nicheLower.includes('工作') || nicheLower.includes('职业')) {
    return '22-40岁的职场新人和中层管理者，希望提升职业技能和工作效率，关注职场发展和个人成长。';
  } else if (nicheLower.includes('创业') || nicheLower.includes('企业家') || nicheLower.includes('商业')) {
    return '25-50岁的有创业想法或已创业的企业家和高管，关注商业模式创新和市场机会，追求事业发展。';
  } else if (nicheLower.includes('学生') || nicheLower.includes('大学') || nicheLower.includes('学习')) {
    return '18-25岁的大学生和研究生，注重学业发展和技能提升，关注就业准备和未来职业规划。';
  } else if (nicheLower.includes('AI') || nicheLower.includes('人工智能') || nicheLower.includes('科技')) {
    return '25-40岁的科技从业者和创新者，关注前沿技术发展，希望通过AI提升工作效率和商业价值。';
  } else if (nicheLower.includes('美妆') || nicheLower.includes('护肤') || nicheLower.includes('化妆')) {
    return '18-35岁的女性消费者，注重外貌管理和个人形象，追求时尚潮流和护肤知识，有一定的消费能力。';
  } else if (nicheLower.includes('美食') || nicheLower.includes('烹饪') || nicheLower.includes('餐厅')) {
    return '20-45岁的生活品质追求者，喜欢尝试新鲜美食和烹饪技巧，注重生活情趣和家庭聚餐。';
  } else if (nicheLower.includes('旅行') || nicheLower.includes('旅游') || nicheLower.includes('出行')) {
    return '25-45岁有一定经济基础的旅游爱好者，追求生活品质和体验，希望通过旅行放松身心和开拓视野。';
  }
  
  // 默认分析
  return '25-40岁的都市专业人士，有一定教育背景和收入水平，关注个人成长和生活品质，是数字原住民，喜欢尝试新事物。';
}

export async function POST(request: NextRequest) {
  try {
    const { niche, topic } = await request.json();

    if (!niche?.trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_INPUT', 
            message: '请提供有效的领域或话题信息' 
          } 
        },
        { status: 400 }
      );
    }

    // 获取API配置
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.AUDIENCE_ANALYZE_MODEL || process.env.OPENAI_MODEL || 'gpt-4';

    if (!apiKey) {
      console.log('API密钥未配置，使用模拟受众分析');
      const mockAnalysis = generateMockAudienceAnalysis(niche);
      return NextResponse.json({
        success: true,
        data: {
          analysis: mockAnalysis,
          fullAnalysis: mockAnalysis
        }
      });
    }

    const openai = new OpenAI({
      apiKey,
      baseURL,
    });

    // 构建分析提示词
    const prompt = `请根据以下领域/话题信息，精准分析目标受众群体。要求：
1. 精准描述受众群体特征
2. 包含年龄范围、性别倾向、职业背景、生活状态等关键信息
3. 字数控制在100字以内
4. 语言简洁有力，符合营销场景需求

领域/话题信息：${niche}
${topic ? `具体话题：${topic}` : ''}

请直接输出受众描述，不需要额外的解释说明。`;

    try {
      console.log(`开始调用受众分析API...`);
      console.log(`API Key存在: ${!!apiKey}`);
      console.log(`Base URL: ${baseURL}`);
      console.log(`使用模型: ${model}`);
      console.log(`专属模型配置: ${process.env.AUDIENCE_ANALYZE_MODEL || '未设置，使用默认模型'}`);
      console.log(`回退模型: ${process.env.OPENAI_MODEL || '未设置'}`);
      
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: '你是一位专业的用户画像分析和目标受众定位专家，擅长精准分析目标受众特征。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      console.log('API响应:', JSON.stringify(completion, null, 2));
      
      const choice = completion.choices[0];
      const audienceAnalysis = choice?.message?.content?.trim();

      console.log('分析结果提取:', {
        hasChoice: !!choice,
        hasMessage: !!choice?.message,
        hasContent: !!choice?.message?.content,
        contentLength: choice?.message?.content?.length || 0,
        contentPreview: choice?.message?.content?.substring(0, 100) || '空',
        finishReason: choice?.finish_reason
      });

      if (!audienceAnalysis) {
        const errorMsg = choice?.finish_reason === 'length' 
          ? 'AI返回内容被截断，请重试或联系管理员调整参数'
          : 'AI返回内容为空';
        throw new Error(errorMsg);
      }

      // 验证返回结果长度
      if (audienceAnalysis.length > 100) {
        // 如果超过100字，进行截取和优化
        const truncated = audienceAnalysis.substring(0, 97) + '...';
        return NextResponse.json({
          success: true,
          data: {
            analysis: truncated,
            fullAnalysis: audienceAnalysis
          }
        });
      }

      return NextResponse.json({
        success: true,
        data: {
          analysis: audienceAnalysis,
          fullAnalysis: audienceAnalysis
        }
      });
    } catch (apiError) {
      console.error('OpenAI API错误:', apiError);
      
      // 返回错误信息
      const errorMessage = apiError instanceof Error ? apiError.message : 'API调用失败';
      return NextResponse.json({
        success: false,
        error: {
          code: 'API_ERROR',
          message: `受众分析失败: ${errorMessage}`
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Audience analysis error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'ANALYSIS_FAILED', 
          message: error instanceof Error ? error.message : '受众分析失败' 
        } 
      },
      { status: 500 }
    );
  }
}
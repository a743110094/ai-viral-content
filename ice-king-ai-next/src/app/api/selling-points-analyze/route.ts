import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 模拟卖点分析函数
function generateMockSellingPoints(niche: string): string {
  const nicheLower = niche.toLowerCase();
  
  // 基于关键词的简单规则匹配
  if (nicheLower.includes('妈妈') || nicheLower.includes('母亲') || nicheLower.includes('育儿')) {
    return '省时省力，科学育儿，专业指导，安全可靠，亲子互动，成长陪伴';
  } else if (nicheLower.includes('健身') || nicheLower.includes('运动') || nicheLower.includes('减肥')) {
    return '科学减脂，快速塑形，专业指导，在家即可，安全有效，持续动力';
  } else if (nicheLower.includes('理财') || nicheLower.includes('投资') || nicheLower.includes('财富')) {
    return '风险可控，收益稳定，专业策略，门槛低，易学易懂，财富增值';
  } else if (nicheLower.includes('职场') || nicheLower.includes('工作') || nicheLower.includes('职业')) {
    return '提升效率，技能进阶，职业发展，薪资增长，人脉拓展，价值提升';
  } else if (nicheLower.includes('创业') || nicheLower.includes('企业家') || nicheLower.includes('商业')) {
    return '市场机会，商业模式，利润丰厚，风险可控，成长空间，执行简单';
  } else if (nicheLower.includes('学生') || nicheLower.includes('大学') || nicheLower.includes('学习')) {
    return '学习效率，成绩提升，技能掌握，考试通关，就业优势，持续成长';
  } else if (nicheLower.includes('AI') || nicheLower.includes('人工智能') || nicheLower.includes('科技')) {
    return '效率提升，智能自动化，创新驱动，成本节约，竞争优势，未来趋势';
  } else if (nicheLower.includes('美妆') || nicheLower.includes('护肤') || nicheLower.includes('化妆')) {
    return '天然成分，效果显著，使用简单，安全温和，性价比高，持久美丽';
  } else if (nicheLower.includes('美食') || nicheLower.includes('烹饪') || nicheLower.includes('餐厅')) {
    return '美味可口，营养健康，制作简单，食材新鲜，口感丰富，家庭幸福';
  } else if (nicheLower.includes('旅行') || nicheLower.includes('旅游') || nicheLower.includes('出行')) {
    return '风景优美，体验独特，放松身心，文化探索，拍照出片，美好回忆';
  }
  
  // 默认卖点
  return '品质保证，效果显著，使用便捷，性价比高，服务专业，用户信赖';
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
    const model = process.env.SELLING_POINTS_ANALYZE_MODEL || process.env.OPENAI_MODEL || 'gpt-4';

    if (!apiKey) {
      console.log('API密钥未配置，使用模拟卖点分析');
      const mockAnalysis = generateMockSellingPoints(niche);
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
    const prompt = `请根据以下领域/话题信息，精准提炼产品卖点。要求：
1. 突出核心价值和竞争优势
2. 包含具体功效和用户收益
3. 字数控制在100字以内
4. 语言简洁有力，符合营销场景需求
5. 使用逗号分隔各个卖点

领域/话题信息：${niche}
${topic ? `具体话题：${topic}` : ''}

请直接输出卖点描述，使用逗号分隔，不需要额外的解释说明。`;

    try {
      console.log(`开始调用卖点分析API...`);
      console.log(`API Key存在: ${!!apiKey}`);
      console.log(`Base URL: ${baseURL}`);
      console.log(`使用模型: ${model}`);
      console.log(`专属模型配置: ${process.env.SELLING_POINTS_ANALYZE_MODEL || '未设置，使用默认模型'}`);
      console.log(`回退模型: ${process.env.OPENAI_MODEL || '未设置'}`);
      
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: '你是一位专业的营销策划专家，擅长提炼产品卖点和核心价值。'
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
      const sellingPointsAnalysis = choice?.message?.content?.trim();

      console.log('卖点分析结果提取:', {
        hasChoice: !!choice,
        hasMessage: !!choice?.message,
        hasContent: !!choice?.message?.content,
        contentLength: choice?.message?.content?.length || 0,
        contentPreview: choice?.message?.content?.substring(0, 100) || '空',
        finishReason: choice?.finish_reason
      });

      if (!sellingPointsAnalysis) {
        const errorMsg = choice?.finish_reason === 'length' 
          ? 'AI返回内容被截断，请重试或联系管理员调整参数'
          : 'AI返回内容为空';
        throw new Error(errorMsg);
      }

      return NextResponse.json({
        success: true,
        data: {
          analysis: sellingPointsAnalysis,
          fullAnalysis: sellingPointsAnalysis
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
          message: `卖点分析失败: ${errorMessage}`
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Selling points analysis error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'ANALYSIS_FAILED', 
          message: error instanceof Error ? error.message : '卖点分析失败' 
        } 
      },
      { status: 500 }
    );
  }
}
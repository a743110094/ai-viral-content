import { NextRequest, NextResponse } from 'next/server';
import { contentGenerator } from '@/lib/content-generator';
import { generateRequestId } from '@/lib/utils';

// 强制API调用的调试端点 - 跳过所有缓存
export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    console.log(`\n🧪 [${requestId}] ====== 调试模式：强制API调用 ======`);
    
    const body = await request.json();
    const { inputs } = body;

    if (!inputs) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_INPUTS',
          message: '缺少必要参数'
        }
      }, { status: 400 });
    }

    // 验证输入
    const validation = contentGenerator.validateInputs(inputs);
    if (!validation.valid) {
      console.log(`[${requestId}] 输入验证失败:`, validation.errors);
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validation.errors.join(', ')
        }
      }, { status: 400 });
    }

    console.log(`[${requestId}] 开始强制API调用，跳过所有缓存...`);
    
    // 强制调用API - 不会使用任何缓存
    const result = await contentGenerator.generateContent(inputs, true); // 第二个参数为true表示强制API调用
    
    const responseTime = Date.now() - startTime;
    console.log(`🧪 [${requestId}] 调试模式生成完成! 总耗时: ${responseTime}ms`);

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        requestId,
        generatedAt: new Date().toISOString(),
        debug: true,
        mode: 'force_api_call',
        apiCallTime: responseTime,
        modelInfo: {
          provider: 'openai',
          model: 'gpt-4',
          version: '1.0'
        }
      }
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`🧪 [${requestId}] 调试模式生成错误:`, error);

    return NextResponse.json({
      success: false,
      error: {
        code: 'DEBUG_GENERATION_ERROR',
        message: error instanceof Error ? error.message : '未知错误'
      },
      meta: {
        requestId,
        debug: true,
        responseTime
      }
    }, { status: 500 });
  }
}

// 简单的GET测试端点
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const test = url.searchParams.get('test');

  if (test === 'api') {
    // 简单的API连接测试
    try {
      const testInputs = {
        niche: 'AI工具测试',
        targetAudience: '科技工作者',
        tone: 'Professional' as const,
        mainGoal: 'Sell Product' as const,
        productLink: 'https://example.com'
      };

      console.log(`🧪 简单API测试开始...`);
      const startTime = Date.now();
      
      const result = await contentGenerator.generateContent(testInputs, true);
      
      const duration = Date.now() - startTime;
      
      return NextResponse.json({
        success: true,
        message: 'API测试成功',
        data: {
          testInputs,
          result: {
            platforms: Object.keys(result).filter(key => key !== 'analytics'),
            generationTime: duration,
            analytics: result.analytics
          }
        },
        meta: {
          test: 'simple_api_call',
          duration,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'API_TEST_ERROR',
          message: error instanceof Error ? error.message : 'API测试失败'
        }
      }, { status: 500 });
    }
  }

  // 默认调试信息
  return NextResponse.json({
    success: true,
    message: '调试端点',
    debug: {
      endpoints: {
        'POST /api/debug/generate': '强制API调用生成内容',
        'GET /api/debug/generate?test=api': '简单API连接测试'
      },
      usage: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          inputs: {
            niche: '你的领域',
            targetAudience: '目标受众',
            tone: 'Professional',
            mainGoal: 'Sell Product',
            productLink: 'https://example.com'
          }
        }
      }
    }
  });
}
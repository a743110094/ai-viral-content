import { NextRequest, NextResponse } from 'next/server';
import { imageGenerator } from '@/lib/image-generator';
import { ImageGenerationRequest } from '@/types/content';

// 生成请求ID的工具函数
const generateRequestId = () => {
  return `img_gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    console.log(`[${requestId}] Image generation request received`);
    
    // Parse request body
    let body: ImageGenerationRequest;
    try {
      body = await request.json();
    } catch (error) {
      console.error(`[${requestId}] Invalid JSON in request body:`, error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_JSON',
            message: '请求格式不正确'
          }
        },
        { status: 400 }
      );
    }

    // Validate request structure
    if (!body.prompts || body.prompts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PROMPTS',
            message: '缺少必要参数：提示词数组'
          }
        },
        { status: 400 }
      );
    }

    if (!body.selectedPlatforms || body.selectedPlatforms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_PLATFORMS',
            message: '缺少必要参数：平台数组'
          }
        },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Validating image generation configuration...`);
    
    // Validate configuration
    const configValidation = await imageGenerator.validateConfig();
    if (!configValidation.valid) {
      console.log(`[${requestId}] Configuration validation failed:`, configValidation.error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFIG_ERROR',
            message: configValidation.error || '生图配置无效'
          }
        },
        { status: 400 }
      );
    }

    console.log(`[${requestId}] Starting image generation...`);
    
    // Generate images
    const results = await imageGenerator.generateImages({
      ...body,
      requestId
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Image generation completed in ${responseTime}ms`);

    // Prepare response data
    const successCount = results.filter(r => r.status === 'success').length;
    const failedCount = results.filter(r => r.status === 'failed').length;

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          success: successCount,
          failed: failedCount,
          totalTime: responseTime
        }
      },
      meta: {
        requestId,
        generatedAt: new Date().toISOString(),
        modelInfo: {
          provider: process.env.IMAGE_GENERATION_PROVIDER || 'OPENAI_DALL_E',
          model: process.env.DALLE_MODEL || 'dall-e-3',
          version: '1.0'
        }
      }
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] Image generation error after ${responseTime}ms:`, error);

    // Determine error type and provide appropriate message
    let errorMessage = '图片生成服务暂时不可用，请稍后重试';
    let errorCode = 'GENERATION_ERROR';

    if (error instanceof Error) {
      if (error.message.includes('未配置OpenAI API密钥')) {
        errorMessage = '生图服务配置错误：请配置OPENAI_API_KEY环境变量';
        errorCode = 'CONFIG_ERROR';
      } else if (error.message.includes('OpenAI')) {
        errorMessage = 'AI图像生成服务暂时不可用，请稍后重试';
        errorCode = 'AI_SERVICE_ERROR';
      } else if (error.message.includes('timeout')) {
        errorMessage = '生成超时，请稍后重试';
        errorCode = 'TIMEOUT_ERROR';
      } else if (error.message.includes('不支持的') || error.message.includes('不支持的')) {
        errorMessage = error.message;
        errorCode = 'UNSUPPORTED_ERROR';
      } else if (error.message.includes('暂不支持的')) {
        errorMessage = error.message;
        errorCode = 'PROVIDER_ERROR';
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
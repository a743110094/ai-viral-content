import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateRequestId } from '@/lib/utils';

interface ImageAnalyzeRequest {
  imageData: string; // Base64 encoded image
  config?: {
    modelProvider?: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
    baseURL?: string; // 支持单独配置API地址
  };
}

interface ImageAnalyzeResponse {
  success: boolean;
  data?: {
    description: string; // 图片详细描述
  };
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    requestId: string;
    analyzedAt: string;
    modelInfo: {
      provider: string;
      model: string;
      version: string;
    };
  };
}

// 获取自定义Base URL的函数
const getBaseURL = (customBaseURL?: string) => {
  return customBaseURL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
};

// 创建OpenAI客户端的函数
const createOpenAIClient = (config?: { apiKey?: string; baseURL?: string }) => {
  const apiKey = config?.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('未配置OpenAI API密钥');
  }
  
  return new OpenAI({
    apiKey,
    baseURL: getBaseURL(config?.baseURL),
  });
};

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    console.log(`[${requestId}] Image analysis request received`);
    
    // Parse request body
    let body: ImageAnalyzeRequest;
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
        } as ImageAnalyzeResponse,
        { status: 400 }
      );
    }

    // Validate request
    if (!body.imageData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_IMAGE_DATA',
            message: '缺少图片数据'
          }
        } as ImageAnalyzeResponse,
        { status: 400 }
      );
    }

    // Create OpenAI client with optional custom config
    const openai = createOpenAIClient({
      baseURL: body.config?.baseURL
    });

    const model = body.config?.modelName || process.env.OPENAI_MODEL || 'gpt-4';
    const temperature = body.config?.temperature || 0.7;
    const maxTokens = body.config?.maxTokens || 500;

    console.log(`[${requestId}] Analyzing image with model: ${model}`);

    // Create vision completion
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一位专业的视觉分析专家。请详细描述图片的主体、前景、背景、色彩、风格等特征，描述要具体生动，字数控制在120-200字之间。'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '请详细描述这张图片的主体、前景、背景、色彩、风格等所有视觉特征，描述要具体生动，字数控制在120-200字之间。'
            },
            {
              type: 'image_url',
              image_url: {
                url: body.imageData
              }
            }
          ]
        }
      ],
      temperature,
      max_tokens: maxTokens,
    });

    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Image analysis completed in ${responseTime}ms`);

    const description = completion.choices[0]?.message?.content;
    
    if (!description) {
      throw new Error('AI返回的描述为空');
    }

    // Validate description length
    const wordCount = description.length;
    console.log(`[${requestId}] Generated description length: ${wordCount} characters`);
    
    if (wordCount < 50) {
      console.warn(`[${requestId}] Description too short, might need retry`);
    }
    
    if (wordCount > 250) {
      console.warn(`[${requestId}] Description too long, might need trimming`);
    }

    return NextResponse.json({
      success: true,
      data: {
        description: description.trim()
      },
      meta: {
        requestId,
        analyzedAt: new Date().toISOString(),
        modelInfo: {
          provider: 'openai',
          model,
          version: '1.0'
        }
      }
    } as ImageAnalyzeResponse);

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] Image analysis error after ${responseTime}ms:`, error);

    let errorMessage = '图片分析服务暂时不可用，请稍后重试';
    let errorCode = 'IMAGE_ANALYZE_ERROR';

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'API密钥无效或已过期，请检查配置';
        errorCode = 'INVALID_API_KEY';
      } else if (error.message.includes('429')) {
        errorMessage = 'API调用频率超限，请稍后重试';
        errorCode = 'RATE_LIMIT_ERROR';
      } else if (error.message.includes('400')) {
        errorMessage = '请求参数错误，请检查图片格式';
        errorCode = 'BAD_REQUEST_ERROR';
      } else if (error.message.includes('413')) {
        errorMessage = '图片文件过大，请选择较小的图片';
        errorCode = 'FILE_TOO_LARGE';
      } else if (error.message.includes('fetch')) {
        errorMessage = '网络连接失败，请检查网络连接和API地址';
        errorCode = 'NETWORK_ERROR';
      } else {
        errorMessage = error.message;
        errorCode = 'API_ERROR';
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      } as ImageAnalyzeResponse,
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
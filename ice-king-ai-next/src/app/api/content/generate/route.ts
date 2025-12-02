import { NextRequest, NextResponse } from 'next/server';
import { contentGenerator } from '@/lib/content-generator';
import { cache } from '@/lib/cache';
import { generateRequestId } from '@/lib/utils';
import { GenerateContentRequest, GenerateContentResponse } from '@/types/content';

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  try {
    console.log(`[${requestId}] Content generation request received`);
    
    // Parse request body
    let body: GenerateContentRequest;
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
        } as GenerateContentResponse,
        { status: 400 }
      );
    }

    // Validate request structure
    if (!body.inputs) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_INPUTS',
            message: '缺少必要参数'
          }
        } as GenerateContentResponse,
        { status: 400 }
      );
    }

    // Validate inputs
    const validation = contentGenerator.validateInputs(body.inputs);
    if (!validation.valid) {
      console.log(`[${requestId}] Input validation failed:`, validation.errors);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: validation.errors.join(', ')
          }
        } as GenerateContentResponse,
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = cache.generateContentCacheKey(body.inputs);
    const cached = await cache.get(cacheKey);
    
    if (cached) {
      console.log(`[${requestId}] Cache hit, returning cached result`);
      const responseTime = Date.now() - startTime;
      
      return NextResponse.json({
        success: true,
        data: cached,
        meta: {
          requestId,
          generatedAt: new Date().toISOString(),
          modelInfo: {
            provider: 'cache',
            model: 'cached',
            version: '1.0'
          },
          cached: true
        }
      } as GenerateContentResponse);
    }

    // Generate content
    const forceApiCall = body.config?.forceApiCall || false;
    console.log(`[${requestId}] Generating fresh content... (forceApiCall: ${forceApiCall})`);
    const result = await contentGenerator.generateContent(body.inputs, forceApiCall);
    
    const responseTime = Date.now() - startTime;
    console.log(`[${requestId}] Content generation completed in ${responseTime}ms`);

    // Return success response
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        requestId,
        generatedAt: new Date().toISOString(),
        modelInfo: {
          provider: 'openai',
          model: 'gpt-4',
          version: '1.0'
        },
        cached: false
      }
    } as GenerateContentResponse);

  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error(`[${requestId}] Content generation error after ${responseTime}ms:`, error);

    // Determine error type and provide appropriate message
    let errorMessage = '内容生成服务暂时不可用，请稍后重试';
    let errorCode = 'GENERATION_ERROR';

    if (error instanceof Error) {
      if (error.message.includes('OpenAI')) {
        errorMessage = 'AI服务暂时不可用，请稍后重试';
        errorCode = 'AI_SERVICE_ERROR';
      } else if (error.message.includes('timeout')) {
        errorMessage = '生成超时，请稍后重试';
        errorCode = 'TIMEOUT_ERROR';
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      } as GenerateContentResponse,
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
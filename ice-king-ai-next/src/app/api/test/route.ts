import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY 环境变量未设置',
        config: {
          baseURL,
          hasApiKey: false
        }
      }, { status: 400 });
    }

    // 创建OpenAI客户端
    const openai = new OpenAI({
      apiKey,
      baseURL,
    });

    // 简单测试调用
    console.log(`🔍 测试API连接: ${baseURL}`);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // 使用更便宜的模型进行测试
      messages: [
        {
          role: 'user',
          content: '请回复 "API连接测试成功"'
        }
      ],
      max_tokens: 50,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    const usage = completion.usage;

    return NextResponse.json({
      success: true,
      message: 'API连接测试成功',
      data: {
        response: responseText,
        model: completion.model,
        usage: {
          prompt_tokens: usage?.prompt_tokens || 0,
          completion_tokens: usage?.completion_tokens || 0,
          total_tokens: usage?.total_tokens || 0
        },
        config: {
          baseURL,
          hasApiKey: true,
          apiKeyPrefix: apiKey.substring(0, 7) + '...'
        }
      }
    });

  } catch (error) {
    console.error('API测试失败:', error);
    
    let errorMessage = '未知错误';
    let errorCode = 'UNKNOWN_ERROR';

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'API密钥无效或已过期';
        errorCode = 'INVALID_API_KEY';
      } else if (error.message.includes('404')) {
        errorMessage = 'API端点不存在，请检查BASE URL';
        errorCode = 'INVALID_ENDPOINT';
      } else if (error.message.includes('429')) {
        errorMessage = 'API调用频率超限';
        errorCode = 'RATE_LIMIT';
      } else if (error.message.includes('fetch')) {
        errorMessage = '网络连接失败，请检查BASE URL';
        errorCode = 'NETWORK_ERROR';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorCode,
      config: {
        baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        hasApiKey: !!process.env.OPENAI_API_KEY
      }
    }, { status: 500 });
  }
}
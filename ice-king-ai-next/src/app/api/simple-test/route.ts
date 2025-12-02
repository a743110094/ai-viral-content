import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request: NextRequest) {
  console.log('\n🚀 ====== 开始简单API测试 ======');
  console.log('📅 测试时间:', new Date().toISOString());
  
  // 检查环境变量
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  
  console.log('🔑 API密钥状态:', apiKey ? '已配置' : '未配置');
  console.log('🌐 API地址:', baseURL);
  
  // 显示模型配置
  const model = process.env.OPENAI_MODEL || 'gpt-4';
  const temperature = process.env.OPENAI_TEMPERATURE || '0.8';
  const maxTokens = process.env.OPENAI_MAX_TOKENS || '2000';
  
  console.log('🤖 AI模型配置:');
  console.log(`   - 模型: ${model}`);
  console.log(`   - 温度: ${temperature}`);
  console.log(`   - 最大Token: ${maxTokens}`);
  
  console.log('📋 环境变量:', {
    OPENAI_API_KEY: apiKey ? `${apiKey.substring(0, 10)}...` : '未设置',
    OPENAI_BASE_URL: baseURL,
    OPENAI_MODEL: model,
    OPENAI_TEMPERATURE: temperature,
    OPENAI_MAX_TOKENS: maxTokens
  });

  if (!apiKey) {
    console.log('❌ 错误: API密钥未配置');
    return NextResponse.json({
      success: false,
      error: 'API密钥未配置',
      debug: {
        hasApiKey: false,
        baseURL,
        timestamp: new Date().toISOString()
      }
    }, { status: 400 });
  }

  try {
    // 创建OpenAI客户端
    console.log('🤖 初始化OpenAI客户端...');
    const openai = new OpenAI({
      apiKey,
      baseURL,
    });
    console.log('✅ OpenAI客户端初始化成功');

    // 进行最简单的API调用
    console.log('📞 准备调用OpenAI API...');
    console.log('📝 请求参数:', {
      model: model,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(maxTokens),
      messages: [{ role: 'user', content: 'Hello! Please respond with "API test successful"' }]
    });
    
    console.log('⏰ 开始API调用，时间:', new Date().toISOString());
    const startTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: model,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(maxTokens),
      messages: [
        {
          role: 'user',
          content: 'Hello! Please respond with "API test successful"'
        }
      ],
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('🎉 API调用成功完成!');
    console.log('⏱️ 调用耗时:', duration + 'ms');
    console.log('📊 响应详情:', {
      model: completion.model,
      usage: completion.usage,
      finishReason: completion.choices[0]?.finish_reason,
      content: completion.choices[0]?.message?.content
    });
    
    const response = {
      success: true,
      message: 'API测试成功',
      data: {
        response: completion.choices[0]?.message?.content,
        model: completion.model,
        usage: completion.usage,
        duration: duration
      },
      debug: {
        apiKeyPrefix: apiKey.substring(0, 10) + '...',
        baseURL,
        timestamp: new Date().toISOString(),
        realApiCall: true
      }
    };
    
    console.log('✅ 测试完成，返回结果');
    console.log('🚀 ====== API测试结束 ======\n');
    
    return NextResponse.json(response);

  } catch (error) {
    console.log('❌ API调用失败!');
    console.log('🔍 错误详情:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // 特别检查常见的错误类型
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        console.log('🔐 错误类型: API密钥无效或已过期');
      } else if (error.message.includes('404')) {
        console.log('🌐 错误类型: API端点不存在，请检查BASE URL');
      } else if (error.message.includes('429')) {
        console.log('⏱️ 错误类型: API调用频率超限');
      } else if (error.message.includes('fetch')) {
        console.log('🌍 错误类型: 网络连接失败');
      }
    }
    
    console.log('❌ ====== API测试失败 ======\n');
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      debug: {
        errorType: error instanceof Error ? error.name : 'Unknown',
        baseURL,
        timestamp: new Date().toISOString(),
        realApiCall: true
      }
    }, { status: 500 });
  }
}
#!/usr/bin/env node

/**
 * 平台扩展功能测试脚本
 * 测试新添加的8个平台选择和内容生成功能
 */

const https = require('https');
const fs = require('fs');

const API_BASE = 'http://localhost:3000/api';

// 测试数据
const testCases = [
  {
    name: '中国平台测试 - 微信、微博、小红书、抖音',
    data: {
      niche: '职场妈妈的时间管理和效率提升',
      productLink: 'https://example.com/time-management-course',
      targetAudience: '25-40岁的职场妈妈，时间管理困难，需要提高生活和工作效率',
      tone: 'Friendly Mentor',
      mainGoal: 'Grow Followers',
      selectedPlatforms: ['wechat', 'weibo', 'xiaohongshu', 'tiktok']
    }
  },
  {
    name: '国际平台测试 - Pinterest、Instagram、Twitter、YouTube',
    data: {
      niche: 'AI productivity tools for entrepreneurs',
      productLink: 'https://example.com/ai-tools',
      targetAudience: 'Tech-savvy entrepreneurs and business owners looking for AI productivity solutions',
      tone: 'Professional',
      mainGoal: 'Drive Affiliate Clicks',
      selectedPlatforms: ['pinterest', 'instagram', 'twitter', 'youtube']
    }
  },
  {
    name: '混合平台测试 - 所有8个平台',
    data: {
      niche: '健康生活方式的数字化管理',
      productLink: 'https://example.com/health-app',
      targetAudience: '注重健康的现代都市人群',
      tone: 'Inspiring',
      mainGoal: 'Build Brand Awareness',
      selectedPlatforms: ['pinterest', 'instagram', 'twitter', 'youtube', 'wechat', 'weibo', 'xiaohongshu', 'tiktok']
    }
  }
];

// HTTP请求函数
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// 测试API接口
async function testContentGeneration(testCase) {
  console.log(`\n🧪 测试案例: ${testCase.name}`);
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch(`${API_BASE}/content/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: testCase.data,
        config: {
          forceApiCall: true // 强制API调用，跳过缓存
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ 请求成功');
    console.log(`📊 响应状态: ${response.status}`);
    
    // 分析生成结果
    if (result.success && result.data) {
      const { analytics, ...platforms } = result.data;
      
      console.log(`\n📈 总体统计:`);
      console.log(`   - 生成时间: ${analytics.totalGenerationTime}ms`);
      console.log(`   - 整体质量: ${analytics.overallQualityScore}/100`);
      console.log(`   - 病毒潜力: ${analytics.viralPotential}%`);
      
      console.log(`\n🎯 生成平台详情:`);
      Object.entries(platforms).forEach(([platform, content]) => {
        if (content && typeof content === 'object') {
          console.log(`   📱 ${platform}:`);
          console.log(`      - 质量分数: ${content.qualityScore}/100`);
          console.log(`      - 内容长度: ${content.mainContent?.length || 0} 字符`);
          console.log(`      - 钩子数量: ${content.hooks?.length || 0}`);
          console.log(`      - 标签数量: ${content.hashtags?.length || 0}`);
        }
      });
      
      return { success: true, data: result.data };
    } else {
      throw new Error('API返回数据格式异常');
    }
    
  } catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始平台扩展功能测试');
  console.log('=' .repeat(60));
  
  // 检查服务器状态
  console.log('🔍 检查服务器状态...');
  try {
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (healthResponse.ok) {
      console.log('✅ 服务器运行正常');
    } else {
      console.log('❌ 服务器健康检查失败');
      return;
    }
  } catch (error) {
    console.log('❌ 无法连接到服务器，请确保 Next.js 开发服务器正在运行');
    return;
  }
  
  // 执行所有测试案例
  const results = [];
  for (const testCase of testCases) {
    const result = await testContentGeneration(testCase);
    results.push({ name: testCase.name, ...result });
  }
  
  // 生成测试报告
  console.log('\n' + '=' .repeat(60));
  console.log('📊 测试结果汇总');
  console.log('=' .repeat(60));
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`总体结果: ${successCount}/${totalCount} 个测试通过`);
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.name}`);
    if (!result.success) {
      console.log(`   错误: ${result.error}`);
    }
  });
  
  if (successCount === totalCount) {
    console.log('\n🎉 所有测试通过！平台扩展功能运行正常。');
  } else {
    console.log(`\n⚠️  有 ${totalCount - successCount} 个测试失败，请检查相关功能。`);
  }
  
  // 保存详细报告
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount
    },
    results
  };
  
  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 详细测试报告已保存到 test-report.json');
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testContentGeneration };
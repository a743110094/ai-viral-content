# API配置说明 - Ice King AI

## 🔥 重要更新

✅ **确认API调用**：系统确实在调用真实的API，不是模拟数据
✅ **自定义Base URL**：支持所有OpenAI协议兼容的API提供商
✅ **详细日志**：完整的API调用状态监控

## 🤖 API调用确认

### 启动时日志
启动开发服务器时，您会看到：
```
🤖 使用API基础地址: https://api.openai.com/v1
```

### 生成内容时日志
每次生成内容时会显示：
```
🚀 开始为Pinterest平台生成内容...
📝 输入参数: {niche: "AI工具", targetAudience: "创业者", tone: "Professional", ...}
🔄 正在调用 https://api.openai.com/v1/chat/completions...
✅ Pinterest内容生成成功! 耗时: 3240ms
📊 API响应信息: {model: "gpt-4", usage: {prompt_tokens: 245, completion_tokens: 512, total_tokens: 757}}
```

**这些日志证明系统正在真正调用API！**

## 🌍 支持的API提供商

### 官方OpenAI
```env
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
```

### 第三方提供商（OpenAI协议兼容）

| 提供商 | Base URL | 特点 |
|--------|----------|------|
| **硅基流动** | `https://api.siliconflow.cn/v1` | 性价比高，支持多种模型 |
| **DeepSeek** | `https://api.deepseek.com/v1` | 专注代码生成，推理能力强 |
| **月之暗面** | `https://api.moonshot.cn/v1` | Kimi模型，长文本处理 |
| **智谱AI** | `https://api.zhipuai.cn/v2` | GLM系列模型，中文优化 |
| **通义千问** | `https://api.qwenlm.cn/v1` | 阿里云千问系列 |
| **MiniMax** | `https://api.minimax.chat/v1/text/chatcompletion_v2` | 海螺AI，语音交互 |
| **讯飞星火** | `https://spark-api-open.xf-yun.com/v1` | 科大讯飞，语音识别 |
| **火山引擎** | `https://ark.cn-beijing.volces.com/api/v3` | 字节跳动豆包 |

## 🛠️ 配置步骤

### 1. 基本配置
```bash
cd ice-king-ai-next
npm install
cp .env.example .env.local
```

### 2. 配置API
编辑 `.env.local` 文件：

```env
# 必需：API密钥
OPENAI_API_KEY=your_api_key_here

# 可选：自定义Base URL
OPENAI_BASE_URL=https://api.siliconflow.cn/v1  # 示例：使用硅基流动

# 可选：Redis缓存
REDIS_URL=redis://localhost:6379
```

### 3. 启动测试
```bash
npm run dev
```

### 4. 验证API连接
访问：`http://localhost:3000/api/test`

成功响应示例：
```json
{
  "success": true,
  "message": "API连接测试成功",
  "data": {
    "response": "API连接测试成功",
    "model": "gpt-3.5-turbo",
    "usage": {
      "prompt_tokens": 15,
      "completion_tokens": 10,
      "total_tokens": 25
    },
    "config": {
      "baseURL": "https://api.siliconflow.cn/v1",
      "hasApiKey": true,
      "apiKeyPrefix": "sk-sil..."
    }
  }
}
```

## 🔍 故障排除

### API密钥无效
```json
{
  "success": false,
  "error": "API密钥无效或已过期",
  "errorCode": "INVALID_API_KEY"
}
```
**解决方案**：检查OPENAI_API_KEY是否正确

### Base URL错误
```json
{
  "success": false,
  "error": "API端点不存在，请检查BASE URL",
  "errorCode": "INVALID_ENDPOINT"
}
```
**解决方案**：确认Base URL格式正确，以/v1结尾

### 网络连接失败
```json
{
  "success": false,
  "error": "网络连接失败，请检查BASE URL",
  "errorCode": "NETWORK_ERROR"
}
```
**解决方案**：检查网络和URL可访问性

## 📊 成本对比

### API调用成本（每次生成）
- **官方OpenAI**: ~$0.05-0.10
- **硅基流动**: ~$0.02-0.05
- **DeepSeek**: ~$0.01-0.03
- **智谱AI**: ~$0.01-0.02

### 缓存节省
- 缓存命中率60%+时，成本可节省50%+
- 相同输入1小时内免费复用

## 🎯 推荐配置

### 开发测试
```env
OPENAI_API_KEY=your_key
OPENAI_BASE_URL=https://api.siliconflow.cn/v1
REDIS_URL=redis://localhost:6379
```

### 生产部署
```env
OPENAI_API_KEY=your_production_key
OPENAI_BASE_URL=https://api.your-provider.com/v1
REDIS_URL=redis://your-redis-host:6379
```

## ✨ 新功能特性

1. **🔍 实时日志**：完整的API调用状态跟踪
2. **🌍 多平台支持**：支持10+主流API提供商
3. **🧪 连接测试**：内置API连接验证工具
4. **📊 使用统计**：详细的token使用监控
5. **⚡ 错误处理**：智能错误诊断和解决建议

---

**立即开始使用**：`npm run dev` → 配置API → 访问 `/api/test` 验证
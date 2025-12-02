# Ice King AI - 爆款内容生成器

一个基于Next.js和OpenAI GPT-4的AI驱动全平台内容生成工具，支持Pinterest、Instagram、Twitter、YouTube四大平台的爆款内容自动生成。

## ✨ 功能特性

- 🚀 **全平台支持**：一键生成4个主流社交媒体平台的内容
- 🤖 **AI驱动**：基于OpenAI GPT-4的智能内容生成
- ⚡ **极速生成**：30秒内完成116个专业内容组件
- 🎯 **精准定位**：基于目标受众的个性化内容创作
- 💎 **质量保证**：智能质量评分和病毒潜力分析
- 🔄 **缓存优化**：Redis缓存提升响应速度
- 📱 **响应式设计**：支持各种设备尺寸

## 🏗️ 技术架构

### 前端
- **Next.js 14** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

### 后端
- **Next.js API Routes** - 服务端API
- **OpenAI GPT-4** - 大语言模型
- **Redis** - 缓存存储
- **TypeScript** - 类型安全

### 部署
- **Vercel** - 推荐部署平台
- **Docker** - 容器化支持
- **环境变量** - 配置管理

## 🚀 快速开始

### 环境要求

- Node.js 18.0.0 或更高版本
- npm、yarn 或 pnpm 包管理器
- OpenAI API Key
- Redis (可选，用于缓存)

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd ice-king-ai-next
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **环境配置**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置必要的环境变量：

```env
# OpenAI API配置 (必需)
OPENAI_API_KEY=your_openai_api_key_here

# 自定义Base URL (可选，支持OpenAI协议兼容API)
OPENAI_BASE_URL=https://api.openai.com/v1

# Redis配置 (可选)
REDIS_URL=redis://localhost:6379

# 应用配置
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 🔍 确认API调用状态

启动开发服务器时，您会看到类似日志：
```
🤖 使用API基础地址: https://api.openai.com/v1
```

生成内容时，您会看到详细的API调用日志：
```
🚀 开始为Pinterest平台生成内容...
📝 输入参数: {niche: "AI工具", ...}
🔄 正在调用 https://api.openai.com/v1/chat/completions...
✅ Pinterest内容生成成功! 耗时: 3240ms
📊 API响应信息: {model: "gpt-4", usage: {...}}
```

这证明系统正在真正调用API而不是返回模拟数据。

4. **启动开发服务器**
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 获取API密钥和配置

#### 方式一：官方OpenAI
1. 访问 [OpenAI官网](https://platform.openai.com/)
2. 注册/登录账号
3. 进入API Keys页面
4. 创建新的API Key
5. 复制Key到 `.env.local` 文件

#### 方式二：第三方OpenAI兼容API
支持所有OpenAI协议兼容的API提供商，只需配置：
```env
OPENAI_API_KEY=your_third_party_api_key
OPENAI_BASE_URL=https://api.your-provider.com/v1
```

**常用第三方提供商**：
- 硅基流动: `https://api.siliconflow.cn/v1`
- DeepSeek: `https://api.deepseek.com/v1`
- 月之暗面: `https://api.moonshot.cn/v1`
- 智谱AI: `https://api.zhipuai.cn/v2`
- 通义千问: `https://api.qwenlm.cn/v1`
- MiniMax: `https://api.minimax.chat/v1/text/chatcompletion_v2`
- 讯飞星火: `https://spark-api-open.xf-yun.com/v1`
- 火山引擎: `https://ark.cn-beijing.volces.com/api/v3`

## 📋 项目结构

```
ice-king-ai-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API路由
│   │   │   ├── content/
│   │   │   │   └── generate/
│   │   │   │       └── route.ts
│   │   │   └── health/
│   │   │       └── route.ts
│   │   ├── generate/          # 生成页面
│   │   │   └── page.tsx
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # React组件
│   │   ├── InputForm.tsx      # 输入表单
│   │   └── ResultsView.tsx    # 结果展示
│   ├── lib/                   # 工具库
│   │   ├── cache.ts           # 缓存服务
│   │   ├── content-generator.ts # 内容生成器
│   │   ├── openai.ts          # OpenAI客户端
│   │   └── utils.ts           # 工具函数
│   └── types/                 # 类型定义
│       └── content.ts         # 内容相关类型
├── .env.example               # 环境变量模板
├── next.config.js             # Next.js配置
├── tailwind.config.ts         # Tailwind配置
├── tsconfig.json              # TypeScript配置
└── package.json               # 项目依赖
```

## 🔌 API文档

### 生成内容

**端点**：`POST /api/content/generate`

**请求体**：
```json
{
  "inputs": {
    "niche": "AI生产力工具",
    "targetAudience": "科技创业者",
    "tone": "Professional",
    "mainGoal": "Sell Product",
    "productLink": "https://example.com"
  },
  "config": {
    "modelProvider": "openai",
    "modelName": "gpt-4",
    "temperature": 0.8,
    "enableCache": true
  }
}
```

**响应体**：
```json
{
  "success": true,
  "data": {
    "pinterest": { /* Pinterest内容 */ },
    "instagram": { /* Instagram内容 */ },
    "twitter": { /* Twitter内容 */ },
    "youtube": { /* YouTube内容 */ },
    "analytics": {
      "totalGenerationTime": 30000,
      "overallQualityScore": 85,
      "viralPotential": 92
    }
  }
}
```

### 健康检查

**端点**：`GET /api/health`

**响应体**：
```json
{
  "status": "healthy",
  "timestamp": "2025-12-01T15:20:39.994Z",
  "services": {
    "api": "up",
    "openai": "configured",
    "redis": "configured"
  }
}
```

## 🧪 开发脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 🚀 部署指南

### Vercel部署 (推荐)

1. **连接GitHub仓库**
   - 访问 [Vercel](https://vercel.com)
   - 导入GitHub仓库

2. **配置环境变量**
   ```
   OPENAI_API_KEY=your_openai_api_key
   REDIS_URL=your_redis_url
   ```

3. **部署**
   - Vercel会自动检测Next.js项目
   - 点击"Deploy"开始部署

### Docker部署

1. **构建镜像**
```bash
docker build -t ice-king-ai .
```

2. **运行容器**
```bash
docker run -p 3000:3000 --env-file .env.local ice-king-ai
```

## 🔧 配置说明

### 环境变量

| 变量名 | 必需 | 描述 | 示例 |
|--------|------|------|------|
| `OPENAI_API_KEY` | ✅ | OpenAI API密钥 | `sk-...` |
| `REDIS_URL` | ❌ | Redis连接URL | `redis://localhost:6379` |
| `NODE_ENV` | ❌ | 运行环境 | `development` |
| `NEXT_PUBLIC_APP_URL` | ❌ | 应用URL | `http://localhost:3000` |

### 缓存配置

项目支持两种缓存模式：

1. **Redis缓存** (推荐)
   - 设置 `REDIS_URL` 环境变量
   - 支持分布式缓存
   - 数据持久化

2. **内存缓存** (默认)
   - 无需额外配置
   - 适合开发和小规模使用
   - 进程重启后缓存失效

## 🐛 故障排除

### 常见问题

1. **如何确认是否真的在调用API？**
   - 启动开发服务器后会显示：`🤖 使用API基础地址: https://api.openai.com/v1`
   - 生成内容时会显示详细的调用日志，包括耗时和响应信息
   - 如果看到这些日志，说明系统正在真正调用API

2. **如何配置第三方OpenAI兼容API？**
   ```env
   OPENAI_API_KEY=your_third_party_key
   OPENAI_BASE_URL=https://api.your-provider.com/v1
   ```
   - 支持所有OpenAI协议兼容的API提供商
   - 启动时会显示使用的API地址

3. **OpenAI API Key无效**
   ```
   Error: API密钥无效或已过期
   ```
   - 检查API Key是否正确
   - 确认API Key有足够余额
   - 验证API Key权限

4. **自定义Base URL配置错误**
   ```
   Error: API服务暂时不可用
   ```
   - 确认Base URL格式正确（以/v1结尾）
   - 检查网络连接和URL可访问性
   - 验证API提供商是否支持OpenAI协议

5. **Redis连接失败**
   ```
   Error: Redis connection error
   ```
   - 检查Redis服务是否运行
   - 验证Redis URL格式
   - 项目会自动回退到内存缓存

6. **生成超时**
   ```
   Error: API调用频率超限
   ```
   - 检查网络连接
   - 确认API服务状态
   - 稍后重试或降低请求频率

### 调试和测试

#### 启用详细日志
```bash
NODE_ENV=development npm run dev
```

#### API连接测试
访问 `http://localhost:3000/api/test` 或使用curl：
```bash
curl http://localhost:3000/api/test
```

这将测试：
- 环境变量配置
- API密钥有效性
- Base URL可访问性
- 实际API调用

#### 查看应用状态
```bash
curl http://localhost:3000/api/health
```

## 📈 性能优化

1. **缓存策略**
   - 相同输入1小时内复用结果
   - Redis集群支持高并发
   - 内存缓存防止雪崩

2. **并发控制**
   - API调用限流保护
   - 队列处理批量请求
   - 优雅降级机制

3. **监控告警**
   - 响应时间监控
   - 错误率告警
   - 成本预算控制

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如有问题或建议，请：

1. 查看 [故障排除](#故障排除) 部分
2. 搜索已存在的 [Issues](../../issues)
3. 创建新的 Issue 描述问题

## 🚀 未来计划

- [ ] 支持更多LLM提供商 (Claude, MiniMax等)
- [ ] 用户认证和历史记录
- [ ] 批量内容生成
- [ ] 内容质量A/B测试
- [ ] 社交媒体发布集成
- [ ] 移动应用支持

---

**Ice King AI** - 让内容创作更智能、更高效！
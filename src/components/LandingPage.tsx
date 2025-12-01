import React from 'react';
import { Zap, Target, TrendingUp, ArrowRight, Sparkles, BarChart3, Users } from 'lucide-react';

interface LandingPageProps {
  onStartCreating: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartCreating }) => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-400 golden-icon-glow" />,
      title: "触达心灵的开篇艺术",
      description: "融入认知心理学精髓，让每个字都直击要害"
    },
    {
      icon: <Target className="w-8 h-8 text-cyan-400 golden-icon-glow" />,
      title: "因地制宜的内容策略",
      description: "深度解析各平台DNA，内容与算法完美契合"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-orange-400 golden-icon-glow" />,
      title: "价值与收益的双重飞跃",
      description: "商业思维融入内容创作，让影响力自然变现"
    }
  ];

  const stats = [
    { number: "50+", label: "精雕细琢的内容模板" },
    { number: "4", label: "主流平台深度赋能" },
    { number: "5", label: "多元化收益模型" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Golden Particles Background */}
      <div className="golden-particles">
        <div className="golden-particle"></div>
        <div className="golden-particle"></div>
        <div className="golden-particle"></div>
        <div className="golden-particle"></div>
        <div className="golden-particle"></div>
        <div className="golden-particle"></div>
      </div>

      {/* Header */}
      <header className="relative overflow-hidden golden-spotlight">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center golden-sparkle">
                <Zap className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white golden-glow-headline">营销端内容创作引擎</h1>
                <p className="text-blue-200 text-sm">让专业洞见成为传播利器</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-blue-200">
              <span className="flex items-center gap-1 golden-border-glow px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 golden-icon-glow" />
                心理学驱动的内容革新
              </span>
              <span className="flex items-center gap-1 golden-border-glow px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4 golden-icon-glow" />
                智能洞察精准赋能
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24 golden-spotlight">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight golden-glow-headline">
              你的洞见，<span className="golden-text-gradient">价值千金</span>
              <br />我们负责让它<span className="text-gradient bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">过目不忘</span>
            </h2>
            <p className="text-xl text-blue-200 leading-relaxed max-w-3xl mx-auto">
              融合认知心理学与传播学精华，深度洞察算法逻辑，
              为Pinterest、Instagram、Twitter、YouTube量身打造具有灵魂的内容，
              让每一次创作都成为影响力的里程碑！
            </p>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 mx-8 bg-slate-800/50 border border-yellow-400/30 rounded-full px-6 py-3 mb-8 golden-border-glow golden-sparkle">
            <Sparkles className="w-5 h-5 text-yellow-400 golden-icon-glow" />
            <span className="text-yellow-400 font-medium">从灵感乍现，到爆款刷屏</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStartCreating}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-2xl golden-glow-button"
          >
            <Zap className="w-6 h-6" />
            开启内容创作之旅
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-blue-300 text-sm mt-4">自在创作 • AI点睛 • 杰作天成</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center transition-all duration-300 group golden-feature-card">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-slate-900/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 golden-sparkle">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-blue-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 golden-spotlight">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center golden-sparkle">
                <div className="text-5xl md:text-6xl font-bold golden-text-gradient mb-2">
                  {stat.number}
                </div>
                <p className="text-blue-200 text-lg font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-12 golden-feature-card">
            <h3 className="text-3xl font-bold text-white mb-6 golden-glow-headline">
              准备好创造属于你的内容传奇了吗？
            </h3>
            <p className="text-xl text-blue-200 mb-8 leading-relaxed">
              加入精英创作者社群，用我们的智能内容引擎重新定义你的影响力边界！
            </p>
            <button
              onClick={onStartCreating}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 shadow-2xl golden-glow-button"
            >
              <Zap className="w-6 h-6" />
              开启内容创作之旅
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer with Ice King YouTube Branding */}
      <footer className="px-4 py-8 border-t border-slate-700 footer-sparkles">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sparkle-burst">
              <div className="ice-king-profile-container">
                <img 
                  src="/images/ice-king-profile.jpg" 
                  alt="Ice King Profile Picture"
                  className="ice-king-profile"
                />
              </div>
              <span className="text-blue-200 font-medium">
                创作者：{' '}
                <a
                  href="http://www.youtube.com/@Iceking-612"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ice-king-link"
                  aria-label="Visit Ice King's YouTube channel"
                >
                  Ice King
                </a>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-blue-300">
              <span className="flex items-center gap-1 footer-sparkles">
                <Users className="w-4 h-4 golden-icon-glow" />
                精英创作者的首选工具
              </span>
              <span className="flex items-center gap-1 footer-sparkles">
                <TrendingUp className="w-4 h-4 golden-icon-glow" />
                成果斐然，赞誉如潮
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
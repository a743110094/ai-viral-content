// Advanced Content Generation Engine for Ice King AI Viral Content Machine

export interface ContentInputs {
  niche: string;
  productLink: string;
  targetAudience: string;
  tone: 'Professional' | 'Humorous' | 'Luxury' | 'Inspiring' | 'Aggressive Marketing' | 'Friendly Mentor';
  mainGoal: 'Grow Followers' | 'Drive Affiliate Clicks' | 'Sell Product' | 'Build Brand Awareness';
}

export interface PlatformContent {
  hooks: string[];
  mainContent: string;
  hashtags: string[];
  imagePrompts: string[];
  abHeadlines: string[];
  qualityScore: number;
}

export interface ContentResults {
  pinterest: PlatformContent;
  instagram: PlatformContent;
  twitter: PlatformContent;
  youtube: PlatformContent;
  analytics: {
    totalGenerationTime: number;
    overallQualityScore: number;
    viralPotential: number;
  };
}

// Viral Hook Templates by Platform
const HOOK_TEMPLATES = {
  pinterest: {
    discovery: [
      "The secret to {niche} that nobody talks about...",
      "5 {niche} mistakes that are costing you {goal}",
      "This {niche} hack changed everything for {audience}",
      "Why your {niche} strategy isn't working (and what to do instead)",
      "The surprising truth about {niche} that {audience} need to know"
    ],
    visual: [
      "Before vs After: {niche} transformation in 30 days",
      "The ultimate {niche} guide for {audience}",
      "Step-by-step {niche} blueprint that actually works",
      "Free {niche} checklist that {audience} are obsessing over",
      "The {niche} method that's taking {platform} by storm"
    ]
  },
  instagram: {
    trending: [
      "POV: You just discovered the {niche} secret that {audience} have been hiding",
      "Tell me you're into {niche} without telling me you're into {niche}",
      "This {niche} trend is about to blow up (save this post)",
      "Things {audience} do that just hit different",
      "The {niche} glow up nobody saw coming"
    ],
    engagement: [
      "Raise your hand if you've ever struggled with {niche} 🙋‍♀️",
      "Comment {emoji} if you can relate to this {niche} struggle",
      "Tag someone who needs to see this {niche} tip",
      "Double tap if you're ready to transform your {niche} game",
      "Save this if you want to master {niche} in 2025"
    ]
  },
  twitter: {
    controversial: [
      "Unpopular opinion: Most {niche} advice is complete garbage",
      "Hot take: {audience} are doing {niche} completely wrong",
      "Everyone's talking about {niche} but missing this crucial point",
      "The {niche} industry doesn't want you to know this",
      "Why I stopped following traditional {niche} advice"
    ],
    thread: [
      "7 {niche} lessons I wish I knew before I started (thread) 🧵",
      "The {niche} framework that changed my life (save this thread)",
      "How to {goal} with {niche} in 30 days (step-by-step thread)",
      "Things about {niche} I wish someone told me sooner (thread)",
      "The truth about {niche} that {audience} need to hear 🧵"
    ]
  },
  youtube: {
    retention: [
      "If you're {audience}, don't click away - this will change your {niche} forever",
      "I spent $10,000 learning {niche} so you don't have to",
      "The {niche} mistake that's keeping {audience} stuck (and how to fix it)",
      "Watch this before you try any other {niche} method",
      "The {niche} secret that gurus charge $1000 for (free here)"
    ],
    curiosity: [
      "What happens when {audience} do this one {niche} thing",
      "The {niche} method everyone's copying but no one's talking about",
      "Why {audience} are obsessed with this {niche} technique",
      "This {niche} trick went viral for a reason",
      "The science behind why this {niche} method works"
    ]
  }
};

// Tone Modifiers
const TONE_MODIFIERS = {
  'Professional': {
    language: 'authoritative, data-driven, industry-focused',
    style: 'formal yet accessible',
    cta: 'Learn more about'
  },
  'Humorous': {
    language: 'witty, playful, relatable',
    style: 'casual and entertaining',
    cta: 'Check out this game-changer'
  },
  'Luxury': {
    language: 'exclusive, premium, sophisticated',
    style: 'elegant and aspirational',
    cta: 'Discover the premium'
  },
  'Inspiring': {
    language: 'motivational, empowering, transformative',
    style: 'uplifting and encouraging',
    cta: 'Start your transformation with'
  },
  'Aggressive Marketing': {
    language: 'urgent, direct, action-oriented',
    style: 'bold and persuasive',
    cta: 'Don\'t miss out on'
  },
  'Friendly Mentor': {
    language: 'supportive, encouraging, personal',
    style: 'warm and approachable',
    cta: 'Let me help you with'
  }
};

// Platform-specific content generators
class ContentGenerationEngine {
  private inputs: ContentInputs;
  private startTime: number;

  constructor(inputs: ContentInputs) {
    this.inputs = inputs;
    this.startTime = Date.now();
  }

  private generateHooks(platform: keyof typeof HOOK_TEMPLATES, count: number = 5): string[] {
    const templates = HOOK_TEMPLATES[platform];
    const allTemplates = Object.values(templates).flat();
    const hooks: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const template = allTemplates[i % allTemplates.length];
      const hook = this.processTemplate(template);
      hooks.push(this.applyToneModification(hook));
    }
    
    return hooks;
  }

  private processTemplate(template: string): string {
    return template
      .replace(/{niche}/g, this.inputs.niche)
      .replace(/{audience}/g, this.inputs.targetAudience)
      .replace(/{goal}/g, this.inputs.mainGoal.toLowerCase())
      .replace(/{platform}/g, 'social media');
  }

  private applyToneModification(content: string): string {
    const modifier = TONE_MODIFIERS[this.inputs.tone];
    
    // Apply tone-specific modifications
    switch (this.inputs.tone) {
      case 'Professional':
        return content.replace(/\b(secret|hack)\b/gi, 'strategy');
      case 'Humorous':
        return content + ' 😅';
      case 'Luxury':
        return content.replace(/\b(tip|hack)\b/gi, 'exclusive insight');
      case 'Inspiring':
        return content.replace(/mistake/gi, 'opportunity for growth');
      case 'Aggressive Marketing':
        return content.toUpperCase().replace(/\./g, '!') + ' ⚡';
      case 'Friendly Mentor':
        return 'Hey friend! ' + content;
      default:
        return content;
    }
  }

  private generatePinterestContent(): PlatformContent {
    const hooks = this.generateHooks('pinterest', 5);
    const title = hooks[0];
    
    const description = `🌟 ${title}

${this.inputs.targetAudience} - this is exactly what you've been looking for!

✨ In this comprehensive guide, you'll discover:
• The proven strategies that actually work
• Step-by-step implementation techniques
• Real results from ${this.inputs.niche} experts
• Actionable tips you can start using today

Don't let another day pass without taking action on your ${this.inputs.niche} goals. The transformation starts here!

👆 ${TONE_MODIFIERS[this.inputs.tone].cta} ${this.inputs.niche} at: ${this.inputs.productLink}

#${this.inputs.niche.replace(/\s+/g, '')} #ViralContent #Success`;

    const hashtags = this.generateHashtags('pinterest');
    const imagePrompts = this.generateImagePrompts('pinterest');
    const abHeadlines = [title, ...this.generateHooks('pinterest', 2)];
    
    return {
      hooks,
      mainContent: description,
      hashtags,
      imagePrompts,
      abHeadlines,
      qualityScore: this.calculateQualityScore(description, 'pinterest')
    };
  }

  private generateInstagramContent(): PlatformContent {
    const hooks = this.generateHooks('instagram', 5);
    const mainHook = hooks[0];
    
    const script = `${mainHook}

🎯 Here's the truth about ${this.inputs.niche}:

Most ${this.inputs.targetAudience} are missing this ONE crucial element that could completely transform their results.

💡 THE GAME-CHANGER:
[Show visual/demonstrate the key concept]

⚡ Here's how to implement this TODAY:
1️⃣ First step: [specific action]
2️⃣ Then: [next action]
3️⃣ Finally: [result action]

🔥 The results speak for themselves:
• Increased engagement by 300%
• Better conversion rates
• More authentic connections

💬 COMMENT "YES" if you're ready to try this!

👆 Get the complete ${this.inputs.niche} system: ${this.inputs.productLink}

📱 Save this post and TAG a friend who needs to see this!

${this.generateHashtags('instagram').slice(0, 20).join(' ')}`;

    return {
      hooks,
      mainContent: script,
      hashtags: this.generateHashtags('instagram'),
      imagePrompts: this.generateImagePrompts('instagram'),
      abHeadlines: hooks.slice(0, 3),
      qualityScore: this.calculateQualityScore(script, 'instagram')
    };
  }

  private generateTwitterContent(): PlatformContent {
    const hooks = this.generateHooks('twitter', 5);
    const mainHook = hooks[0];
    
    const thread = `1/${5} ${mainHook}

Here's what I learned after helping 1000+ ${this.inputs.targetAudience}:

2/${5} ❌ MISTAKE #1: Focusing on tactics instead of strategy

Most people jump straight into ${this.inputs.niche} without understanding the fundamentals. This leads to frustration and wasted time.

✅ DO THIS INSTEAD: Build a solid foundation first.

3/${5} ❌ MISTAKE #2: Following outdated advice

The ${this.inputs.niche} landscape changes rapidly. What worked in 2020 doesn't work in 2025.

✅ DO THIS INSTEAD: Stay updated with current best practices.

4/${5} ❌ MISTAKE #3: Not tracking results

You can't improve what you don't measure. Most ${this.inputs.targetAudience} are flying blind.

✅ DO THIS INSTEAD: Set up proper tracking from day one.

5/${5} 🎯 Ready to avoid these mistakes?

I've created a comprehensive ${this.inputs.niche} system that addresses all of these issues.

👆 Get instant access: ${this.inputs.productLink}

RT if this thread was helpful! 🔄`;

    return {
      hooks,
      mainContent: thread,
      hashtags: this.generateHashtags('twitter'),
      imagePrompts: this.generateImagePrompts('twitter'),
      abHeadlines: hooks.slice(0, 3),
      qualityScore: this.calculateQualityScore(thread, 'twitter')
    };
  }

  private generateYouTubeContent(): PlatformContent {
    const hooks = this.generateHooks('youtube', 5);
    const mainHook = hooks[0];
    
    const script = `[0-5s] HOOK: ${mainHook}

[5-10s] PROBLEM AGITATION:
"Look, I get it. You've tried everything for ${this.inputs.niche}, but nothing seems to stick. You're frustrated, maybe even thinking about giving up..."

[10-20s] CREDIBILITY & PROMISE:
"But what if I told you there's ONE method that ${this.inputs.targetAudience} are using right now to completely transform their results? In the next 45 seconds, I'm going to show you exactly how."

[20-35s] VALUE DELIVERY:
"Here's the secret sauce: [Visual demonstration]

Step 1: [Show specific action]
Step 2: [Show next action]
Step 3: [Show result]

This changes everything because..."

[35-45s] STRONG CTA:
"If you want the complete ${this.inputs.niche} system that includes templates, worksheets, and step-by-step videos, check the link in my bio.

Don't forget to like this video and follow for more ${this.inputs.niche} tips!"

VISUAL CUES:
• Use dynamic text overlays for key points
• Quick cuts every 3-4 seconds
• Visual demonstrations of concepts
• Before/after comparisons
• Trending audio/music`;

    return {
      hooks,
      mainContent: script,
      hashtags: this.generateHashtags('youtube'),
      imagePrompts: this.generateImagePrompts('youtube'),
      abHeadlines: hooks.slice(0, 3),
      qualityScore: this.calculateQualityScore(script, 'youtube')
    };
  }

  private generateHashtags(platform: string): string[] {
    const baseHashtags = [
      this.inputs.niche.replace(/\s+/g, '').toLowerCase(),
      this.inputs.targetAudience.split(' ')[0].toLowerCase(),
      'viral', 'trending', 'tips', 'strategy', 'success', 'growth', 'motivation'
    ];

    const platformSpecific = {
      pinterest: ['pinteresttips', 'pinterestmarketing', 'socialmedia', 'contentcreator', 'entrepreneur'],
      instagram: ['reels', 'instagramtips', 'contentcreator', 'socialmediamarketing', 'hustle'],
      twitter: ['thread', 'twitterthread', 'startup', 'entrepreneur', 'productivity'],
      youtube: ['shorts', 'youtubeshorts', 'contentcreator', 'videotips', 'tutorial']
    };

    const goalSpecific = {
      'Grow Followers': ['followme', 'community', 'engagement', 'socialgrowth'],
      'Drive Affiliate Clicks': ['affiliate', 'deals', 'discount', 'recommendation'],
      'Sell Product': ['product', 'launch', 'sale', 'business'],
      'Build Brand Awareness': ['brand', 'marketing', 'awareness', 'visibility']
    };

    const allHashtags = [
      ...baseHashtags,
      ...platformSpecific[platform as keyof typeof platformSpecific] || [],
      ...goalSpecific[this.inputs.mainGoal] || []
    ];

    return allHashtags.slice(0, 15).map(tag => `#${tag}`);
  }

  private generateImagePrompts(platform: string): string[] {
    const baseStyle = TONE_MODIFIERS[this.inputs.tone].style;
    
    const prompts = [
      `${baseStyle} image showing ${this.inputs.niche} transformation, professional photography, high quality`,
      `Minimalist graphic design featuring ${this.inputs.niche} concepts, modern typography, brand colors`,
      `Behind-the-scenes photo of ${this.inputs.targetAudience} using ${this.inputs.niche} strategies, authentic feel`,
      `Infographic displaying ${this.inputs.niche} tips, clean design, easy to read, shareable format`,
      `Lifestyle photo representing ${this.inputs.niche} success, aspirational mood, professional lighting`
    ];

    return prompts;
  }

  private calculateQualityScore(content: string, platform: string): number {
    let score = 0;
    
    // Hook strength (25 points)
    const hasStrongHook = /\b(secret|surprising|mistake|truth|nobody|hidden)\b/i.test(content);
    score += hasStrongHook ? 25 : 15;
    
    // Emotional triggers (25 points)
    const emotionalWords = /\b(transform|amazing|incredible|shocking|life-changing|game-changer)\b/i.test(content);
    score += emotionalWords ? 25 : 15;
    
    // Call to action (20 points)
    const hasCTA = content.includes(this.inputs.productLink) || /\b(click|check|get|download|buy)\b/i.test(content);
    score += hasCTA ? 20 : 10;
    
    // Platform optimization (15 points)
    const platformOptimized = platform === 'twitter' ? content.length < 2800 : true;
    score += platformOptimized ? 15 : 5;
    
    // Audience relevance (15 points)
    const audienceRelevant = content.toLowerCase().includes(this.inputs.targetAudience.toLowerCase());
    score += audienceRelevant ? 15 : 5;
    
    return Math.min(score, 100);
  }

  public generateAll(): ContentResults {
    const results: ContentResults = {
      pinterest: this.generatePinterestContent(),
      instagram: this.generateInstagramContent(),
      twitter: this.generateTwitterContent(),
      youtube: this.generateYouTubeContent(),
      analytics: {
        totalGenerationTime: Date.now() - this.startTime,
        overallQualityScore: 0,
        viralPotential: 0
      }
    };

    // Calculate overall metrics
    const allScores = [results.pinterest.qualityScore, results.instagram.qualityScore, results.twitter.qualityScore, results.youtube.qualityScore];
    results.analytics.overallQualityScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
    results.analytics.viralPotential = Math.min(results.analytics.overallQualityScore + Math.random() * 20, 100);

    return results;
  }
}

export function generateContentPackage(inputs: ContentInputs): ContentResults {
  const engine = new ContentGenerationEngine(inputs);
  return engine.generateAll();
}

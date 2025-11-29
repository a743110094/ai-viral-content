# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the **Ice King AI Viral Content Machine** - a React + TypeScript web application that generates viral, monetization-ready content for multiple social media platforms (Pinterest, Instagram, Twitter, YouTube). The app features a sophisticated client-side content generation engine with psychology-based templates and platform-specific optimization.

## Tech Stack

- **React 18.3** + **TypeScript** - Type-safe UI development
- **Vite 6.0** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling with custom "Ice King" theme (dark navy gradients, golden accents, lightning bolt ⚡ branding)
- **React Hook Form** + **Zod** - Form handling and validation
- **Lucide React** - Icon system
- **pnpm** - Package manager

## Common Commands

```bash
# Install dependencies
pnpm install

# Start development server (with auto-install)
pnpm dev

# Build for production
pnpm build

# Build for production (alternate command)
pnpm build:prod

# Run linter
pnpm lint

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx      # Hero landing page with feature showcase
│   ├── InputForm.tsx        # Multi-step form for content inputs
│   ├── ResultsView.tsx      # Display generated content with copy functionality
│   └── ErrorBoundary.tsx    # Error handling wrapper
├── services/
│   └── contentGenerator.ts  # Core content generation engine (420+ lines)
├── hooks/
│   └── use-mobile.tsx       # Mobile detection hook
├── lib/
│   └── utils.ts             # Utility functions
├── App.tsx                  # Main app with state management (landing/form/loading/results)
└── main.tsx                 # App entry point
```

Path alias configured: `@` maps to `./src`

## High-Level Architecture

### State Management (App.tsx)
The app uses a simple state machine with 4 states:
1. **landing** - Hero page with CTAs
2. **form** - Input collection form
3. **loading** - Animated loading screen (2s delay)
4. **results** - Generated content display with navigation

### Content Generation Engine (contentGenerator.ts)

The core generation engine (`ContentGenerationEngine` class, ~300 lines) implements:

**Input Parameters:**
- `niche` (string) - Content topic/niche
- `productLink` (string) - Monetization link
- `targetAudience` (string) - Intended audience
- `tone` (enum) - 6 modes: Professional, Humorous, Luxury, Inspiring, Aggressive Marketing, Friendly Mentor
- `mainGoal` (enum) - Grow Followers, Drive Affiliate Clicks, Sell Product, Build Brand Awareness

**Generation Process:**
1. Template-based hook generation (5 hooks per platform)
2. Tone-specific language modifications
3. Platform-native content structure
4. Hashtag generation (15 optimized tags)
5. Image prompt creation (5 AI-ready descriptions)
6. A/B headline variations
7. Quality scoring (0-100 based on hooks, emotional triggers, CTAs, platform optimization)

**Platform-Specific Optimization:**
- **Pinterest**: Discovery/visual templates, description format, aesthetic focus
- **Instagram**: Engagement hooks, story-style script, emoji usage
- **Twitter**: Thread format (5 tweets), controversial angles, character limits
- **YouTube**: Script with timestamps, retention hooks, visual cues

**Template System:**
- `HOOK_TEMPLATES` object with platform-specific hook formulas
- `TONE_MODIFIERS` apply linguistic changes based on selected tone
- Template variables: `{niche}`, `{audience}`, `{goal}`, `{platform}`

## Design System

**Theme**: "Ice King" premium aesthetic
- Background: Dark navy gradient (`from-slate-900 via-blue-900 to-slate-900`)
- Primary: Golden/yellow gradients (`from-yellow-400 to-orange-500`)
- Accents: Cyan, blue, orange for features
- Effects: Golden glows, sparkle animations, backdrop blur (glass morphism)

**Custom CSS Classes** (defined in App.css):
- `.golden-*` - Glow and sparkle effects
- `.golden-text-gradient` - Golden gradient text
- `.golden-glow-button` - CTA button with glow
- `.golden-spotlight` - Spotlight background effect
- `.golden-particles` - Animated background particles

## Key Features

1. **Multi-Platform Content**: Generates 4 platform versions simultaneously
2. **Quality Scoring**: AI-powered content analysis (hooks, emotional triggers, CTAs)
3. **One-Click Copy**: Clipboard functionality for all content blocks
4. **Responsive Design**: Mobile-first with perfect desktop scaling
5. **Form Validation**: Zod-based validation with real-time feedback
6. **Error Handling**: ErrorBoundary wrapper for graceful failures
7. **Progressive UX**: Loading states, navigation, and smooth transitions

## Development Notes

- **No Backend**: All processing is client-side, instant generation
- **Type Safety**: Extensive TypeScript interfaces for inputs/outputs
- **Performance**: Optimized algorithms, memory efficient
- **Linting**: ESLint 9.x with TypeScript support, some rules disabled (no-unused-vars, explicit-any)
- **Build Config**: Vite with source info plugin (disabled in prod builds)

## Platform-Specific Content Patterns

- **Pinterest**: Focus on visual discovery, comprehensive guides, transformation stories
- **Instagram**: Engagement-driven, story format, emoji-rich, community interaction
- **Twitter**: Thread structure, controversial takes, actionable insights
- **YouTube**: Retention hooks, timestamped scripts, visual cue instructions

## Viral Mechanics

The engine implements proven viral patterns:
- Curiosity gaps ("The secret that nobody talks about...")
- Controversy ("Unpopular opinion...")
- Social proof ("This changed everything...")
- Authority ("I spent $10,000 learning...")
- Urgency ("Watch this before...")

## Recent Changes

Last commit: `dfb7a14 init` - Initial repository setup

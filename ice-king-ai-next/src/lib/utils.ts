import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function calculateQualityScore(content: string, platform: string): number {
  let score = 0;
  
  // Hook strength (25 points)
  const hasStrongHook = /\b(secret|surprising|mistake|truth|nobody|hidden)\b/i.test(content);
  score += hasStrongHook ? 25 : 15;
  
  // Emotional triggers (25 points)
  const emotionalWords = /\b(transform|amazing|incredible|shocking|life-changing|game-changer)\b/i.test(content);
  score += emotionalWords ? 25 : 15;
  
  // Call to action (20 points)
  const hasCTA = /\b(click|check|get|download|buy|visit|see|learn|discover)\b/i.test(content);
  score += hasCTA ? 20 : 10;
  
  // Platform optimization (15 points)
  const platformOptimized = platform === 'twitter' ? content.length < 2800 : true;
  score += platformOptimized ? 15 : 5;
  
  // Content quality (15 points)
  const hasStructure = /^[#*\-\d]|\n/.test(content);
  score += hasStructure ? 15 : 5;
  
  return Math.min(score, 100);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  return fn().catch(error => {
    if (maxRetries <= 0) throw error;
    
    const delay = baseDelay * Math.pow(2, 3 - maxRetries);
    return sleep(delay).then(() => retryWithBackoff(fn, maxRetries - 1, baseDelay));
  });
}
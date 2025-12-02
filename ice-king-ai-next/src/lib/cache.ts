import { ContentResults } from '@/types/content';

class CacheService {
  private memoryCache = new Map<string, { value: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 3600; // 1 hour
  private readonly MAX_MEMORY_CACHE_SIZE = 1000;

  constructor() {
    console.log('🚀 CacheService initialized with memory cache only (Redis disabled)');
    console.log('💾 Using memory cache for better performance and stability');
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      // Only use memory cache
      const cached = this.memoryCache.get(key);
      if (!cached) return null;
      
      // Check if expired
      if (Date.now() - cached.timestamp > cached.ttl * 1000) {
        this.memoryCache.delete(key);
        return null;
      }
      
      return cached.value;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      // Only use memory cache
      if (this.memoryCache.size >= this.MAX_MEMORY_CACHE_SIZE) {
        // Remove oldest entry
        const firstKey = this.memoryCache.keys().next().value;
        if (firstKey) {
          this.memoryCache.delete(firstKey);
        }
      }
      
      this.memoryCache.set(key, {
        value,
        timestamp: Date.now(),
        ttl,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.memoryCache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      this.memoryCache.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return this.memoryCache.has(key);
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Generate cache key for content generation
  generateContentCacheKey(inputs: any): string {
    const content = JSON.stringify(inputs);
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `content:${Math.abs(hash)}`;
  }

  // Cleanup expired entries in memory cache
  cleanupMemoryCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    this.memoryCache.forEach((cached, key) => {
      if (now - cached.timestamp > cached.ttl * 1000) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => {
      this.memoryCache.delete(key);
    });
  }

  // Get cache statistics
  getStats() {
    return {
      memoryCacheSize: this.memoryCache.size,
      maxMemoryCacheSize: this.MAX_MEMORY_CACHE_SIZE,
      usingRedis: false,
      usingMemoryCache: true
    };
  }
}

// Global cache instance
export const cache = new CacheService();

// Periodic cleanup for memory cache
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cache.cleanupMemoryCache();
  }, 5 * 60 * 1000); // Cleanup every 5 minutes
}
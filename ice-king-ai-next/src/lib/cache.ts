import Redis from 'ioredis';
import { ContentResults } from '@/types/content';

class CacheService {
  private redis: Redis | null = null;
  private memoryCache = new Map<string, { value: any; timestamp: number; ttl: number }>();
  private readonly DEFAULT_TTL = 3600; // 1 hour
  private readonly MAX_MEMORY_CACHE_SIZE = 1000;

  constructor() {
    this.initializeRedis();
  }

  private initializeRedis() {
    const redisUrl = process.env.REDIS_URL;
    
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl, {
          enableReadyCheck: false,
          maxRetriesPerRequest: 3,
        });
        
        this.redis.on('error', (error) => {
          console.warn('Redis connection error, falling back to memory cache:', error.message);
          this.redis = null;
        });
        
        this.redis.on('connect', () => {
          console.log('Redis connected successfully');
        });
      } catch (error) {
        console.warn('Failed to initialize Redis, using memory cache:', error);
        this.redis = null;
      }
    } else {
      console.log('REDIS_URL not provided, using memory cache');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.redis) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Fallback to memory cache
        const cached = this.memoryCache.get(key);
        if (!cached) return null;
        
        // Check if expired
        if (Date.now() - cached.timestamp > cached.ttl * 1000) {
          this.memoryCache.delete(key);
          return null;
        }
        
        return cached.value;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      
      if (this.redis) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        // Memory cache fallback
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
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.del(key);
      } else {
        this.memoryCache.delete(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.flushall();
      } else {
        this.memoryCache.clear();
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (this.redis) {
        const result = await this.redis.exists(key);
        return result === 1;
      } else {
        return this.memoryCache.has(key);
      }
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
    if (!this.redis) {
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
import { supabase } from './supabase';

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 60000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 300000;

export const securityService = {
  async verifyAdminRole(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return false;
      }

      return data.role === 'admin';
    } catch {
      return false;
    }
  },

  async requireAdmin(userId: string): Promise<{ authorized: boolean; error?: string }> {
    const isAdmin = await this.verifyAdminRole(userId);
    
    if (!isAdmin) {
      return { 
        authorized: false, 
        error: 'Unauthorized: Admin access required' 
      };
    }

    return { authorized: true };
  },

  checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry) {
      rateLimitStore.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return { allowed: true };
    }

    if (now - entry.firstAttempt > RATE_LIMIT_WINDOW) {
      rateLimitStore.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
      return { allowed: true };
    }

    if (entry.count >= MAX_ATTEMPTS) {
      const lockoutRemaining = Math.ceil((LOCKOUT_DURATION - (now - entry.firstAttempt)) / 1000);
      return { 
        allowed: false, 
        retryAfter: Math.max(lockoutRemaining, 0) 
      };
    }

    entry.count++;
    entry.lastAttempt = now;
    return { allowed: true };
  },

  resetRateLimit(identifier: string): void {
    rateLimitStore.delete(identifier);
  },

  cleanupRateLimitStore(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now - entry.firstAttempt > LOCKOUT_DURATION) {
        rateLimitStore.delete(key);
      }
    }
  },
};

setInterval(() => {
  securityService.cleanupRateLimitStore();
}, 60000);

export const requireAdmin = securityService.requireAdmin.bind(securityService);
export const checkRateLimit = securityService.checkRateLimit.bind(securityService);

import { supabase } from '../lib/supabase';
import { securityService } from './security';

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const identifier = `signup:${email.toLowerCase()}`;
    const rateLimit = securityService.checkRateLimit(identifier);
    
    if (!rateLimit.allowed) {
      return { 
        success: false, 
        error: `Too many signup attempts. Please try again in ${rateLimit.retryAfter} seconds.` 
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        if (error.message.includes('rate limit')) {
          return { 
            success: false, 
            error: 'Too many signup attempts. Please wait and try again.' 
          };
        }
        
        let errorMessage = error.message;
        
        if (error.message.includes('already been registered')) {
          errorMessage = 'This email is already registered. Try signing in.';
        } else if (error.message.includes('valid email')) {
          errorMessage = 'Please enter a valid email address';
        }

        return { success: false, error: errorMessage };
      }

      if (data?.user) {
        try {
          await supabase.from('users').insert({
            id: data.user.id,
            email,
            name,
            role: 'user',
          });
        } catch {
          // Profile creation failed, but auth succeeded
        }
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Sign up failed' 
      };
    }
  },

  async signIn(email: string, password: string) {
    const identifier = `signin:${email.toLowerCase()}`;
    const rateLimit = securityService.checkRateLimit(identifier);
    
    if (!rateLimit.allowed) {
      return { 
        success: false, 
        error: `Too many login attempts. Please try again in ${rateLimit.retryAfter} seconds.` 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many attempts - please wait a moment';
        }

        return { success: false, error: errorMessage };
      }

      securityService.resetRateLimit(identifier);

      return { success: true, user: data.user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Sign in failed' 
      };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch {
      return null;
    }
  },

  async resetPassword(email: string) {
    const identifier = `reset:${email.toLowerCase()}`;
    const rateLimit = securityService.checkRateLimit(identifier);
    
    if (!rateLimit.allowed) {
      return { 
        success: false, 
        error: `Too many password reset attempts. Please try again in ${rateLimit.retryAfter} seconds.` 
      };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async verifyAdmin(userId: string) {
    return securityService.verifyAdminRole(userId);
  },
};

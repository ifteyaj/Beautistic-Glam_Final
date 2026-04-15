/**
 * ============================================
 * SIMPLIFIED AUTH SERVICE
 * Production-ready authentication
 * ============================================
 */

import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, name: string) {
    console.log('[Auth] Signup attempt:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        console.error('[Auth] Signup error:', error);
        
        let errorMessage = error.message;
        
        if (error.message.includes('rate limit')) {
          errorMessage = 'email rate limit exceeded - please wait 60 seconds';
        } else if (error.message.includes('already been registered')) {
          errorMessage = 'This email is already registered. Try signing in.';
        } else if (error.message.includes('valid email')) {
          errorMessage = 'Please enter a valid email address';
        }

        return { success: false, error: errorMessage };
      }

      console.log('[Auth] Signup response:', data);

      if (data?.user) {
        console.log('[Auth] User created:', data.user.id);

        try {
          await supabase.from('users').insert({
            id: data.user.id,
            email,
            name,
            role: 'user',
          });
        } catch (profileError: any) {
          console.warn('[Auth] Profile note:', profileError.message);
        }
      }

      if (data?.confirmation_sent === true) {
        return { 
          success: true, 
          needsConfirmation: true,
          message: 'Please check your email to confirm your account' 
        };
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('[Auth] Signup exception:', error);
      return { 
        success: false, 
        error: error.message || 'Sign up failed' 
      };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    console.log('[Auth] Signin attempt:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Auth] Signin error:', error);
        
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

      console.log('[Auth] Signin success:', data.user?.email);

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('[Auth] Signin exception:', error);
      return { 
        success: false, 
        error: error.message || 'Sign in failed' 
      };
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    console.log('[Auth] Signout');

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

  /**
   * Get current session
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      return null;
    }
  },

  /**
   * Reset password - send reset email
   */
  async resetPassword(email: string) {
    console.log('[Auth] Password reset request:', email);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined,
      });

      if (error) {
        console.error('[Auth] Reset error:', error);
        return { success: false, error: error.message };
      }

      console.log('[Auth] Reset email sent');
      return { success: true };
    } catch (error: any) {
      console.error('[Auth] Reset exception:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update password (when logged in)
   */
  async updatePassword(newPassword: string) {
    console.log('[Auth] Password update');

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
};

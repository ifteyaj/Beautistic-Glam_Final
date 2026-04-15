import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/auth';
import type { User as AppUser } from '../types';

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Fetch user profile from users table
  const fetchUserProfile = useCallback(async (userId: string, userEmail?: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Profile doesn't exist, return basic user with email from auth
        return {
          id: userId,
          email: userEmail || '',
          name: 'User',
          role: 'user' as const,
        };
      }

      // Use email from auth if profile doesn't have it
      return {
        ...data,
        email: data.email || userEmail || '',
      } as AppUser;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {
        id: userId,
        email: userEmail || '',
        name: 'User',
        role: 'user' as const,
      };
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      console.log('[Auth] Initializing...');
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('[Auth] Session found:', session.user.email);
          const userData = await fetchUserProfile(session.user.id, session.user.email);
          
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('[Auth] No session');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('[Auth] Init error:', error);
        if (mounted) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] State change:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = await fetchUserProfile(session.user.id, session.user.email);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('[Auth] Token refreshed');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  // Sign up
  const signUp = async (email: string, password: string, name: string) => {
    console.log('[Auth] Sign up:', email);
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await authService.signUp(email, password, name);

    if (result.success && result.user) {
      const userData = await fetchUserProfile(result.user.id, result.user.email);
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } else if (result.success && result.needsConfirmation) {
      // Email confirmation required
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }

    return result;
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    console.log('[Auth] Sign in:', email);
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await authService.signIn(email, password);

    if (result.success && result.user) {
      const userData = await fetchUserProfile(result.user.id, result.user.email);
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }

    return result;
  };

  // Sign out
  const signOut = async () => {
    console.log('[Auth] Sign out');
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    await authService.signOut();
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Reset password - request reset email
  const resetPassword = async (email: string) => {
    console.log('[Auth] Reset password:', email);
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await authService.resetPassword(email);
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return result;
  };

  // Update password when logged in
  const updatePassword = async (newPassword: string) => {
    console.log('[Auth] Update password');
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    const result = await authService.updatePassword(newPassword);
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
    return result;
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
};

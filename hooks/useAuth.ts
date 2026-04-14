import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../lib/services';
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

  const fetchUser = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // User profile might not exist yet, create basic user
        return {
          id: userId,
          email: '',
          name: 'User',
          role: 'user' as const,
        };
      }

      return data as AppUser;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await fetchUser(session.user.id);
          setAuthState({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = await fetchUser(session.user.id);
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
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUser]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await authService.signUp(email, password, name);

      if (!result.success) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return result;
      }

      // Get user data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userData = await fetchUser(user.id);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      }

      return result;
    } catch (error: any) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || 'Sign up failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const result = await authService.signIn(email, password);

      if (!result.success) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return result;
      }

      // Get user data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userData = await fetchUser(user.id);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      }

      return result;
    } catch (error: any) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await authService.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
};

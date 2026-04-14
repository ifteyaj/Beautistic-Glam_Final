import { useState, useEffect, useCallback } from 'react';
import { supabase, User } from '../lib/supabase';
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
        console.error('Error fetching user:', error);
        return null;
      }

      return data as AppUser;
    } catch (error) {
      console.error('Error in fetchUser:', error);
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
      console.log('>>> Attempting signup with:', email);
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      console.log('>>> Signup response - data:', !!data.user, 'error:', error);

      if (error) throw error;

      if (data.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          name,
          role: 'user',
        });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        const userData = await fetchUser(data.user.id);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || 'Sign up failed' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('>>> Attempting signin with:', email);
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('>>> Signin response - data:', !!data.user, 'error:', error);

      if (error) throw error;

      if (data.user) {
        const userData = await fetchUser(data.user.id);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await supabase.auth.signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
  };
};

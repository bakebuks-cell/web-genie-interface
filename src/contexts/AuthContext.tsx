import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { clearGuestSession, getGuestSessionData } from '@/hooks/useCredits';

type PlanType = 'free' | 'pro' | 'enterprise';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  plan: PlanType;
  created_at: string;
  updated_at: string;
}

interface UserCredits {
  id: string;
  user_id: string;
  credits_remaining: number;
  last_reset_date: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userCredits: UserCredits | null;
  isLoading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updatePlan: (plan: PlanType) => Promise<{ error: Error | null }>;
  deductCredit: () => Promise<boolean>;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      // Check if credits need to be reset (new day in user's timezone)
      const today = new Date().toISOString().split('T')[0];
      if (data.last_reset_date !== today) {
        // Reset credits for new day
        const { data: updatedData } = await supabase
          .from('user_credits')
          .update({
            credits_remaining: 5,
            last_reset_date: today,
          })
          .eq('user_id', userId)
          .select()
          .single();
        
        if (updatedData) {
          setUserCredits(updatedData as UserCredits);
          return;
        }
      }
      setUserCredits(data as UserCredits);
    }
  };

  const refreshCredits = async () => {
    if (user) {
      await fetchCredits(user.id);
    }
  };

  const mergeGuestSession = async (userId: string) => {
    const guestData = getGuestSessionData();
    if (guestData) {
      // If guest had used some credits, sync that to the user account
      const today = new Date().toISOString().split('T')[0];
      if (guestData.lastReset === today && guestData.credits < 5) {
        // Guest used some credits today, update user credits
        await supabase
          .from('user_credits')
          .update({
            credits_remaining: guestData.credits,
            last_reset_date: today,
          })
          .eq('user_id', userId);
      }
      // Clear guest session after merging
      clearGuestSession();
    }
  };

  const applySelectedPlan = async (userId: string) => {
    const selectedPlan = localStorage.getItem('selected_plan') as PlanType | null;
    if (selectedPlan && selectedPlan !== 'free') {
      await supabase
        .from('profiles')
        .update({ plan: selectedPlan })
        .eq('user_id', userId);
      
      // For paid plans, set unlimited credits
      await supabase
        .from('user_credits')
        .update({ credits_remaining: -1 })
        .eq('user_id', userId);
      
      localStorage.removeItem('selected_plan');
    }
  };

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Use setTimeout to avoid potential race conditions
        setTimeout(async () => {
          await fetchProfile(session.user.id);
          await fetchCredits(session.user.id);
          
          // Merge guest session on sign in
          if (event === 'SIGNED_IN') {
            await mergeGuestSession(session.user.id);
            await applySelectedPlan(session.user.id);
            await fetchProfile(session.user.id);
            await fetchCredits(session.user.id);
          }
        }, 0);
      } else {
        setProfile(null);
        setUserCredits(null);
      }
      
      setIsLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchCredits(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          display_name: displayName,
        },
      },
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setUserCredits(null);
  };

  const updatePlan = async (plan: PlanType) => {
    if (!user) {
      return { error: new Error('Not authenticated') };
    }

    const { error } = await supabase
      .from('profiles')
      .update({ plan })
      .eq('user_id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, plan } : null);
      
      // If upgrading to pro/enterprise, set unlimited credits (represented as -1)
      if (plan !== 'free') {
        await supabase
          .from('user_credits')
          .update({ credits_remaining: -1 })
          .eq('user_id', user.id);
        
        await fetchCredits(user.id);
      }
    }

    return { error: error as Error | null };
  };

  const deductCredit = async (): Promise<boolean> => {
    if (!user || !userCredits) return false;
    
    // Unlimited credits for pro/enterprise
    if (profile?.plan === 'pro' || profile?.plan === 'enterprise') {
      return true;
    }
    
    // Check if user has credits (and not unlimited)
    if (userCredits.credits_remaining <= 0 && userCredits.credits_remaining !== -1) {
      return false;
    }
    
    // Unlimited credits (represented as -1)
    if (userCredits.credits_remaining === -1) {
      return true;
    }

    const newCredits = userCredits.credits_remaining - 1;
    
    const { error } = await supabase
      .from('user_credits')
      .update({ credits_remaining: newCredits })
      .eq('user_id', user.id);

    if (!error) {
      setUserCredits(prev => prev ? { ...prev, credits_remaining: newCredits } : null);
      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        userCredits,
        isLoading,
        signUp,
        signIn,
        signOut,
        updatePlan,
        deductCredit,
        refreshCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

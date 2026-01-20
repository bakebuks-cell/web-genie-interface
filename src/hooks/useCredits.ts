import { useState, useEffect, useCallback } from 'react';

const GUEST_CREDITS_KEY = 'databuks_guest_credits';
const GUEST_LAST_RESET_KEY = 'databuks_guest_last_reset';
const FREE_DAILY_CREDITS = 5;

interface GuestCredits {
  credits: number;
  lastReset: string;
}

function getLocalDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getGuestCredits(): GuestCredits {
  const storedCredits = localStorage.getItem(GUEST_CREDITS_KEY);
  const storedLastReset = localStorage.getItem(GUEST_LAST_RESET_KEY);
  const today = getLocalDateString();
  
  // Check if we need to reset credits (new day)
  if (storedLastReset !== today) {
    // Reset credits for new day
    localStorage.setItem(GUEST_CREDITS_KEY, String(FREE_DAILY_CREDITS));
    localStorage.setItem(GUEST_LAST_RESET_KEY, today);
    return { credits: FREE_DAILY_CREDITS, lastReset: today };
  }
  
  const credits = storedCredits ? parseInt(storedCredits, 10) : FREE_DAILY_CREDITS;
  return { credits, lastReset: storedLastReset || today };
}

function setGuestCredits(credits: number): void {
  localStorage.setItem(GUEST_CREDITS_KEY, String(credits));
}

export function useGuestCredits() {
  const [credits, setCredits] = useState<number>(FREE_DAILY_CREDITS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const { credits: storedCredits } = getGuestCredits();
    setCredits(storedCredits);
    setIsLoaded(true);
  }, []);

  const deductCredit = useCallback((): boolean => {
    const { credits: currentCredits } = getGuestCredits();
    
    if (currentCredits <= 0) {
      return false;
    }
    
    const newCredits = currentCredits - 1;
    setGuestCredits(newCredits);
    setCredits(newCredits);
    return true;
  }, []);

  const hasCredits = credits > 0;

  return {
    credits,
    hasCredits,
    deductCredit,
    isLoaded,
    maxCredits: FREE_DAILY_CREDITS,
  };
}

export function getGuestSessionData(): { credits: number; lastReset: string } | null {
  const credits = localStorage.getItem(GUEST_CREDITS_KEY);
  const lastReset = localStorage.getItem(GUEST_LAST_RESET_KEY);
  
  if (credits && lastReset) {
    return {
      credits: parseInt(credits, 10),
      lastReset,
    };
  }
  return null;
}

export function clearGuestSession(): void {
  localStorage.removeItem(GUEST_CREDITS_KEY);
  localStorage.removeItem(GUEST_LAST_RESET_KEY);
}

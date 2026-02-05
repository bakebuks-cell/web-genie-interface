/**
 * Maps raw Supabase/backend error messages to user-friendly messages.
 * This prevents internal details (like "Invalid API key") from leaking to end users.
 */

const ERROR_MAP: Record<string, string> = {
  'invalid api key': 'Something went wrong. Please try again later.',
  'invalid claim: missing sub claim': 'Something went wrong. Please try again later.',
  'apikey': 'Something went wrong. Please try again later.',
  'fetch failed': 'Unable to connect. Please check your internet and try again.',
  'failed to fetch': 'Unable to connect. Please check your internet and try again.',
  'network': 'Unable to connect. Please check your internet and try again.',
  'networkerror': 'Unable to connect. Please check your internet and try again.',
  'invalid login credentials': 'Incorrect email or password. Please try again.',
  'email not confirmed': 'Please verify your email before signing in. Check your inbox.',
  'user already registered': 'An account with this email already exists. Try signing in instead.',
  'signup requires a valid password': 'Please enter a valid password (at least 6 characters).',
  'password should be at least': 'Password must be at least 6 characters long.',
  'rate limit exceeded': 'Too many attempts. Please wait a moment and try again.',
  'email rate limit exceeded': 'Too many attempts. Please wait a moment and try again.',
};

export function sanitizeAuthError(error: Error | string | null | undefined): string {
  if (!error) return 'Something went wrong. Please try again.';
  
  const message = typeof error === 'string' ? error : error.message;
  if (!message) return 'Something went wrong. Please try again.';
  
  const lowerMessage = message.toLowerCase();
  
  for (const [pattern, friendlyMessage] of Object.entries(ERROR_MAP)) {
    if (lowerMessage.includes(pattern)) {
      return friendlyMessage;
    }
  }
  
  // If no match, check for generic server/config errors that shouldn't be shown
  if (
    lowerMessage.includes('api key') ||
    lowerMessage.includes('apikey') ||
    lowerMessage.includes('service_role') ||
    lowerMessage.includes('jwt') ||
    lowerMessage.includes('pgrst') ||
    lowerMessage.includes('postgrest')
  ) {
    return 'Something went wrong. Please try again later.';
  }
  
  // Return the original message if it seems user-safe
  return message;
}

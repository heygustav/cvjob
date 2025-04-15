
import { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  redirectUrl: string | null;
  attemptCount: number;
  isNewUser?: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  isLoggingOut?: boolean;
  handleAuthentication: (email: string, password: string, isSignUp: boolean, name?: string) => Promise<void>;
  setRedirectUrl: (url: string | null) => void;
  resetAttemptCount: () => void;
  setIsNewUser?: (isNew: boolean) => void;
}

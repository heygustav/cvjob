
import { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  redirectUrl: string | null;
  attemptCount: number;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string, name?: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  handleAuthentication: (email: string, password: string, isSignUp: boolean, name?: string) => Promise<void>;
  setRedirectUrl: (url: string | null) => void;
  resetAttemptCount: () => void;
}

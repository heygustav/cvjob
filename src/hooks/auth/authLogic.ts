
import { useSignIn } from './useSignIn';
import { useSignUp } from './useSignUp';
import { useSignOut } from './useSignOut';
import { useHandleAuthentication } from './useHandleAuthentication';

export const useAuthLogic = (
  isLoading: boolean,
  attemptCount: number,
  redirectUrl: string | null,
  resetAttemptCount: () => void,
  setAttemptCount: (count: number) => void
) => {
  // Use the sign-in hook
  const signIn = useSignIn({
    isLoading,
    attemptCount,
    redirectUrl,
    setAttemptCount
  });

  // Use the sign-up hook
  const signUp = useSignUp({
    attemptCount,
    redirectUrl,
    setAttemptCount
  });

  // Use the sign-out hook
  const signOut = useSignOut({
    resetAttemptCount
  });

  // Use the handle-authentication hook
  const handleAuthentication = useHandleAuthentication({
    isLoading,
    signIn,
    signUp
  });

  return {
    signIn,
    signUp,
    signOut,
    handleAuthentication,
  };
};

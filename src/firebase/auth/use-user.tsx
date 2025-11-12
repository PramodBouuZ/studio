'use client';

import { useContext } from 'react';
import { FirebaseContext, type UserHookResult } from '@/firebase/provider';

/**
 * Hook to access the current user's authentication state.
 * This is a convenience hook that isolates user-specific data from the main `useFirebase` hook.
 * It's safer for components that only need to know about the user, not all Firebase services.
 * Throws an error if used outside of a FirebaseProvider.
 */
export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }

  return {
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

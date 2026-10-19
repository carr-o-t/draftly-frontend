import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useSignOut = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/sign-out', {
        method: 'POST',
      });
      router.push('/auth');
      router.refresh(); // make the server components re-run so they see the cleared cookies
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { signOut, isLoading };
};

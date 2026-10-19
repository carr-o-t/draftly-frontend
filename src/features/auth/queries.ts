import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { AuthRequest, AuthResponse } from './types';
import { authKeys } from './keys';

export const useLoginOrRegister = () => {
  return useMutation({
    mutationKey: authKeys.loginOrRegister(),
    mutationFn: (credentials: AuthRequest) =>
      apiRequest<AuthResponse>('/api/auth', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    // the auth forms show the error inline so we can skip toast
    meta: { skipToast: true },
  });
};

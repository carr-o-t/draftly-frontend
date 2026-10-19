import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from './api';

export type QueryMeta = {
  skipToast?: boolean | ((error: unknown) => boolean);
};

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: QueryMeta;
    mutationMeta: QueryMeta;
  }
}

function shouldSkipToast(meta: QueryMeta | undefined, error: unknown) {
  if (typeof meta?.skipToast === 'function') return meta.skipToast(error);
  return meta?.skipToast === true;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (shouldSkipToast(query.meta, error)) return;
      toast.error(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (shouldSkipToast(mutation.meta, error)) return;
      toast.error(getErrorMessage(error));
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, ApiError } from '@/lib/api';
import { documentKeys } from './queries';
import {
  CreateDocumentRequest,
  UpdateDocumentRequest,
  InviteUserRequest,
  HandleAccessRequest,
  Document,
} from './types';

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentRequest) =>
      apiRequest<{ success: boolean; data: Document }>('/api/documents', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

export const useUpdateDocument = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDocumentRequest) =>
      apiRequest<{ success: boolean; data: Document }>(`/api/documents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ success: boolean }>(`/api/documents/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

export const useInviteUsers = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) =>
      apiRequest<{ success: boolean }>(`/api/documents/${id}/share`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.permissions(id) });
    },
  });
};

export const useRevokeAccess = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      apiRequest<{ success: boolean }>(`/api/documents/${id}/share/${userId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.permissions(id) });
    },
  });
};

export const useRequestAccess = (id: string) => {
  return useMutation({
    mutationFn: async (data: { role: 'viewer' | 'editor' }) => {
      try {
        return await apiRequest<{ success: boolean }>(
          `/api/documents/${id}/request-access`,
          {
            method: 'POST',
            body: JSON.stringify(data),
          }
        );
      } catch (error) {
        // a pending request is not a real error for the user
        if (
          error instanceof ApiError &&
          error.status === 409 &&
          error.message === 'request already pending'
        ) {
          return { pending: true };
        }
        throw error;
      }
    },
  });
};

export const useHandleRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: HandleAccessRequest;
    }) =>
      apiRequest<{ success: boolean }>(
        `/api/documents/${id}/requests/${requestId}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.requests() });
    },
  });
};

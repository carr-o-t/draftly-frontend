import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentKeys } from './queries';
import {
  CreateDocumentRequest,
  UpdateDocumentRequest,
  InviteUserRequest,
  HandleAccessRequest,
} from './types';

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDocumentRequest) => {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

export const useUpdateDocument = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateDocumentRequest) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete document');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
  });
};

export const useInviteUsers = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteUserRequest) => {
      const response = await fetch(`/api/documents/${id}/share`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to invite users');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.permissions(id) });
    },
  });
};

export const useRevokeAccess = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/documents/${id}/share/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to revoke access');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.permissions(id) });
    },
  });
};

export const useRequestAccess = (id: string) => {
  return useMutation({
    mutationFn: async (data: { role: 'viewer' | 'editor' }) => {
      const response = await fetch(`/api/documents/${id}/request-access`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        // a pending request is not a real error for the user
        if (
          response.status === 409 &&
          body?.message === 'request already pending'
        ) {
          return { pending: true };
        }
        throw new Error(body?.message || 'Failed to request access');
      }
      return response.json();
    },
  });
};

export const useHandleRequest = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      data,
    }: {
      requestId: string;
      data: HandleAccessRequest;
    }) => {
      const response = await fetch(
        `/api/documents/${id}/requests/${requestId}`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error('Failed to handle request');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.requests() });
    },
  });
};

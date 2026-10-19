import { useQuery } from '@tanstack/react-query';
import { apiRequest, ApiError } from '@/lib/api';
import {
  DocumentListResponse,
  Document,
  Permission,
  AccessRequest,
} from './types';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  permissions: (id: string) =>
    [...documentKeys.detail(id), 'permissions'] as const,
  requests: () => [...documentKeys.all, 'requests'] as const,
};

export const useDocuments = () => {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: () => apiRequest<DocumentListResponse>('/api/documents'),
  });
};

export const useDocument = (id: string) => {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () =>
      apiRequest<{ success: boolean; data: Document }>(`/api/documents/${id}`),
    enabled: !!id,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 403) return false;
      return failureCount < 3;
    },
    // the editor shows a dedicated request-access card on 403, no toast needed
    meta: {
      skipToast: (error) => error instanceof ApiError && error.status === 403,
    },
  });
};

export const useDocumentPermissions = (id: string) => {
  return useQuery({
    queryKey: documentKeys.permissions(id),
    queryFn: () =>
      apiRequest<{ success: boolean; data: Permission[] }>(
        `/api/documents/${id}/share`
      ),
    enabled: !!id,
  });
};

export const useAccessRequests = () => {
  return useQuery({
    queryKey: documentKeys.requests(),
    queryFn: () =>
      apiRequest<{
        success: boolean;
        data: { sent: AccessRequest[]; received: AccessRequest[] };
      }>('/api/documents/requests'),
  });
};

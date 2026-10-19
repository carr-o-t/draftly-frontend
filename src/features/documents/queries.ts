import { useQuery } from '@tanstack/react-query';
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
    queryFn: async (): Promise<DocumentListResponse> => {
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
  });
};

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const useDocument = (id: string) => {
  return useQuery<{ success: boolean; data: Document }, ApiError>({
    queryKey: documentKeys.detail(id),
    queryFn: async (): Promise<{ success: boolean; data: Document }> => {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log('QUERY RES :::', data);
        console.log('status ::: ', response.status);
        throw new ApiError(
          data.message || 'Failed to fetch document',
          response.status
        );
      }
      return response.json();
    },
    enabled: !!id,
    retry: (failureCount, error) => {
      // console.log("QUERY RES :::", error)
      if (error instanceof ApiError && error.status === 403) return false;
      return failureCount < 3;
    },
  });
};

export const useDocumentPermissions = (id: string) => {
  return useQuery({
    queryKey: documentKeys.permissions(id),
    queryFn: async (): Promise<{ success: boolean; data: Permission[] }> => {
      const response = await fetch(`/api/documents/${id}/share`);
      if (!response.ok) throw new Error('Failed to fetch permissions');
      return response.json();
    },
    enabled: !!id,
  });
};

export const useAccessRequests = () => {
  return useQuery({
    queryKey: documentKeys.requests(),
    queryFn: async (): Promise<{
      success: boolean;
      data: { sent: AccessRequest[]; received: AccessRequest[] };
    }> => {
      const response = await fetch(`/api/documents/requests`);
      if (!response.ok) throw new Error('Failed to fetch access requests');
      return response.json();
    },
  });
};

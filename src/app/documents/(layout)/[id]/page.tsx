import { DocumentEditor } from '@/components/document-editor';
import { documentKeys } from '@/features/documents/queries';
import { backendUrl } from '@/lib/backend';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: documentKeys.detail(id),
    queryFn: async () => {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;

      const response = await fetch(backendUrl(`/documents/${id}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      return response.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DocumentEditor />
    </HydrationBoundary>
  );
}

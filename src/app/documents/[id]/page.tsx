import { DocumentEditor } from "@/components/document-editor";
import { documentKeys } from "@/features/documents/queries";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: documentKeys.detail(id),
        queryFn: async () => {
            const cookieStore = await cookies();
            const token = cookieStore.get("auth_token")?.value;

            // Fetch directly from backend to avoid Next.js API loop and for better perf
            // Note: Ideally use ENV var for backend URL
            const response = await fetch(`http://localhost:8080/v1/documents/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                // Return null or handle error freely, generic placeholder for now
                // We won't throw because we want the client to perhaps try or show error state
                // But for prefetch, throwing means it just won't be in cache.
                throw new Error("Failed to fetch document");
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
'use client';

import { useSearchParams } from 'next/navigation';
import { useDocuments } from '../queries';
import { DocumentCard } from './document-card';
import { Loader2, FilePlus } from 'lucide-react';
import { useCreateDocument } from '../mutations';

export function DocumentList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const { data, isLoading, isError, error } = useDocuments();
  const { mutate: createDocument, isPending } = useCreateDocument();

  const handleCreateDocument = () => {
    createDocument({ title: 'Untitled Document' });
  };

  if (isLoading) {
    return (
      <div className="grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-muted/30 h-64 rounded-xl border"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-destructive text-lg font-medium">
          Failed to load documents
        </p>
        <p className="text-muted-foreground text-sm">{error?.message}</p>
      </div>
    );
  }

  // Combine my documents and shared documents for now, or just show my documents
  // The design shows "My Documents" section.
  // Let's filter based on search query

  const myDocuments = data?.data?.my_documents || [];
  const sharedDocuments = data?.data?.shared_with_me || [];

  // Simple client-side search
  const filteredMyDocs = myDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredSharedDocs = sharedDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasNoDocs =
    filteredMyDocs.length === 0 && filteredSharedDocs.length === 0;

  if (hasNoDocs) {
    if (searchQuery) {
      return (
        <div className="flex h-[50vh] flex-col items-center justify-center text-center">
          <p className="text-muted-foreground text-lg font-medium">
            No documents found matching &quot;{searchQuery}&quot;
          </p>
        </div>
      );
    }

    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="bg-primary/10 rounded-full p-4">
          <FilePlus className="text-primary h-8 w-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">No documents yet</h3>
          <p className="text-muted-foreground text-sm">
            Create your first document to get started
          </p>
        </div>
        <button
          onClick={handleCreateDocument}
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FilePlus className="h-4 w-4" />
          )}
          Create Document
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
      {filteredMyDocs.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              My Documents
            </h2>
            <span className="text-muted-foreground text-sm">
              {filteredMyDocs.length} documents
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMyDocs.map((doc) => (
              <DocumentCard key={doc.id} docData={doc} />
            ))}
          </div>
        </section>
      )}

      {filteredSharedDocs.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Shared with Me
            </h2>
            <span className="text-muted-foreground text-sm">
              {filteredSharedDocs.length} documents
            </span>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredSharedDocs.map((doc) => (
              <DocumentCard key={doc.id} docData={doc} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

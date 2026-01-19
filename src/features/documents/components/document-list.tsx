"use client";

import { useSearchParams } from "next/navigation";
import { useDocuments } from "../queries";
import { DocumentCard } from "./document-card";
import { Loader2, FilePlus } from "lucide-react";

interface DocumentListProps {
}

export function DocumentList({ }: DocumentListProps) {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    const { data, isLoading, isError, error } = useDocuments();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 rounded-xl border bg-muted/30"></div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                <p className="text-lg font-medium text-destructive">Failed to load documents</p>
                <p className="text-sm text-muted-foreground">{error?.message}</p>
            </div>
        );
    }

    // Combine my documents and shared documents for now, or just show my documents 
    // The design shows "My Documents" section.
    // Let's filter based on search query

    const myDocuments = data?.data?.my_documents || [];
    const sharedDocuments = data?.data?.shared_with_me || [];

    // Simple client-side search
    const filteredMyDocs = myDocuments.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredSharedDocs = sharedDocuments.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const hasNoDocs = filteredMyDocs.length === 0 && filteredSharedDocs.length === 0;

    if (hasNoDocs) {
        if (searchQuery) {
            return (
                <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                    <p className="text-lg font-medium text-muted-foreground">No documents found matching "{searchQuery}"</p>
                </div>
            );
        }

        return (
            <div className="flex h-[50vh] flex-col items-center justify-center text-center space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                    <FilePlus className="h-8 w-8 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">No documents yet</h3>
                    <p className="text-sm text-muted-foreground">Create your first document to get started</p>
                </div>
                <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                    <FilePlus className="h-4 w-4" />
                    Create Document
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredMyDocs.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold tracking-tight">My Documents</h2>
                        <span className="text-sm text-muted-foreground">{filteredMyDocs.length} documents</span>
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
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold tracking-tight">Shared with Me</h2>
                        <span className="text-sm text-muted-foreground">{filteredSharedDocs.length} documents</span>
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

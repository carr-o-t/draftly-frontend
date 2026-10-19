"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, FileText, Cloud, CloudOff, Loader2, Eye, Lock, CheckCircle2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { RenameDocumentModal } from "@/features/documents/components/rename-document-modal";
import { ShareDocumentModal } from "@/features/documents/components/share-document-modal";
import { ApiError, useDocument } from "@/features/documents/queries";
import { useUpdateDocument, useRequestAccess } from "@/features/documents/mutations";
import { RequestAccessCard } from "@/features/documents/components/request-access-card";
import { useCollaboration } from "@/features/collaboration/use-collaboration";
import { TiptapEditor } from "./tiptap-editor";

const DocumentEditor = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useDocument(id);
    const { provider, ydoc, userColor, connected } = useCollaboration(id);

    const title = useMemo(() => !error && data?.data.title || "Untitled Document", [data, error]);

    // viewers can only read; owner/editor can edit
    const readOnly = data?.data.role === "viewer";

    const { mutate: updateDocument } = useUpdateDocument(id);
    const { mutate: requestEditAccess, isPending: isRequesting, isSuccess: requestSent } = useRequestAccess(id);

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [renameOpen, setRenameOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const titleRef = useRef(title);
    useEffect(() => {
        titleRef.current = title;
    }, [title]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // debounced save function
    const debouncedSave = useCallback(
        (content: string) => {
            if (readOnly) return;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setIsSaving(true);

            timeoutRef.current = setTimeout(() => {
                updateDocument({
                    title: titleRef.current,
                    content
                }, {
                    onSuccess: () => {
                        setIsSaving(false);
                        setLastSaved(new Date());
                    },
                    onError: () => {
                        setIsSaving(false);
                    }
                });
            }, 1000);
        },
        [updateDocument]
    );

    const handleBack = () => {
        // if there's no prior page, go to the dashboard instead of staying stuck
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
        } else {
            router.replace("/documents");
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;

    if (error instanceof ApiError && error.status === 403) {
        return <RequestAccessCard documentId={id} />;
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="iconSm"
                            onClick={handleBack}
                            className="shrink-0"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary shrink-0" />
                            <button
                                onClick={() => !readOnly && setRenameOpen(true)}
                                disabled={readOnly}
                                className="text-base sm:text-lg font-medium text-foreground hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-[400px] text-left disabled:hover:text-foreground disabled:cursor-default"
                            >
                                {title}
                            </button>
                            {readOnly && (
                                <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    <Eye className="h-3 w-3" />
                                    Read only
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {readOnly ? (
                            requestSent ? (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Request sent
                                </span>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => requestEditAccess({ role: "editor" })}
                                    disabled={isRequesting}
                                    className="gap-2"
                                >
                                    {isRequesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                                    Request Edit Access
                                </Button>
                            )
                        ) : (
                            <>
                                {/* save status */}
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                            {isSaving ? (
                                <>
                                    <CloudOff className="h-3.5 w-3.5" />
                                    <span>Saving...</span>
                                </>
                            ) : lastSaved ? (
                                <>
                                    <Cloud className="h-3.5 w-3.5 text-success" />
                                    <span>Saved</span>
                                </>
                            ) : null}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShareOpen(true)}
                            className="gap-2"
                        >
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* editor */}
            {provider && ydoc && connected ? (
                <TiptapEditor
                    provider={provider}
                    ydoc={ydoc}
                    userColor={userColor}
                    readOnly={readOnly}
                    onSave={debouncedSave}
                    setIsSaving={setIsSaving}
                    setLastSaved={setLastSaved}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Connecting...</span>
                </div>
            )}


            {/* dialogs */}
            {renameOpen && <RenameDocumentModal
                documentId={id || ""}
                currentTitle={title}
                isOpen={renameOpen}
                onClose={() => setRenameOpen(false)}
                // TODO: get content from editor itself
                // passing empty string is safe for rename modal usually
                currentContent=""
            />}

            {shareOpen && <ShareDocumentModal
                documentId={id || ""}
                documentTitle={title}
                isOpen={shareOpen}
                onClose={() => setShareOpen(false)}
            />}
        </div>
    );
};

export { DocumentEditor };

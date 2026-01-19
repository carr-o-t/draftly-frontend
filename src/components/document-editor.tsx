"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, FileText, Cloud, CloudOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { EditorToolbar } from "./editor-toolbar";
import { RenameDocumentModal } from "@/features/documents/components/rename-document-modal";
import { ShareDocumentModal } from "@/features/documents/components/share-document-modal";
import { ApiError, useDocument } from "@/features/documents/queries";
import { useUpdateDocument } from "@/features/documents/mutations";
import { RequestAccessCard } from "@/features/documents/components/request-access-card";

const DocumentEditor = () => {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useDocument(id);

    console.log(error, error?.message, error?.status)


    // ... existing logic
    const title = useMemo(() => !error && data?.data.title || "Untitled Document", [data, error]);

    // Use ref for title to access latest value in timeout closure without recreating callback
    const titleRef = useRef(title);
    useEffect(() => {
        titleRef.current = title;
    }, [title]);

    const { mutate: updateDocument } = useUpdateDocument(id);

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [renameOpen, setRenameOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "Start typing...",
            }),
        ],
        content: "",
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[calc(100vh-180px)] px-4 py-6 sm:px-8 sm:py-8",
            },
        },
        onUpdate: ({ editor }) => {
            debouncedSave(editor.getHTML());
        },
    });

    // Load document
    useEffect(() => {
        if (id && data && !error) {
            // Only set content if editor is empty to avoid overwriting user sorting hydration
            if (editor && editor.isEmpty) {
                editor.commands.setContent(data.data.content);
            }
        }
    }, [id, editor, data, error]); // Added data dependency to ensure load

    // Debounced save function
    const debouncedSave = useCallback(
        (content: string) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setIsSaving(true);

            timeoutRef.current = setTimeout(() => {
                updateDocument({
                    title: titleRef.current, // Use ref to get latest title
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
        [updateDocument] // Stable dependency
    );


    const handleBack = () => {
        router.back();
    };

    if (isLoading) return <div className="">loading...</div>
    // If access denied (403), show Request Access API
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
                                onClick={() => setRenameOpen(true)}
                                className="text-base sm:text-lg font-medium text-foreground hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-[400px] text-left"
                            >
                                {title}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Save status */}
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
                    </div>
                </div>
            </header>

            {/* Editor */}
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <EditorToolbar editor={editor} />

                <div className="flex-1 bg-card border-x border-border">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Dialogs */}
            {renameOpen && <RenameDocumentModal
                documentId={id || ""}
                currentTitle={title}
                isOpen={renameOpen}
                onClose={() => setRenameOpen(false)}
                currentContent={editor?.getHTML() || ""}
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

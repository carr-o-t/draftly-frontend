"use client"

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import { useEffect } from "react";
import { EditorToolbar } from "./editor-toolbar";
import { CollaborationCursorV3 } from "@/features/collaboration/collab-cursor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface TiptapEditorProps {
    provider: WebsocketProvider;
    ydoc: Y.Doc;
    userColor: string;
    readOnly: boolean;
    onSave: (content: string) => void;
    setIsSaving: (saving: boolean) => void;
    setLastSaved: (date: Date) => void;
}

export const TiptapEditor = ({
    provider,
    ydoc,
    userColor,
    readOnly,
    onSave,
    setIsSaving,
    setLastSaved
}: TiptapEditorProps) => {

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                history: false, // collaboration will handle history
                heading: {
                    levels: [1, 2, 3],
                },
            } as any),
            Placeholder.configure({
                placeholder: readOnly ? "This document is read-only" : "Start typing...",
            }),
            Collaboration.configure({
                document: ydoc,
            }),
            CollaborationCursorV3.configure({
                provider,
                user: {
                    name: provider.awareness.getLocalState()?.user?.name || "Anonymous",
                    color: userColor,
                },
            }),
        ],
        editable: !readOnly,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[calc(100vh-180px)] px-4 py-6 sm:px-8 sm:py-8",
            },
        },
        onUpdate: ({ editor }) => {
            if (!readOnly) {
                onSave(editor.getHTML());
            }
        },
        immediatelyRender: false,
    }, []); 

    useEffect(() => {
        if (editor) {
            editor.setEditable(!readOnly);
        }
    }, [editor, readOnly]);

    return (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            {!readOnly && <EditorToolbar editor={editor} />}
            <div className="flex-1 bg-card border-x border-border">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

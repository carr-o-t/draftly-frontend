'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Collaboration from '@tiptap/extension-collaboration';
import { useEffect } from 'react';
import { EditorToolbar } from './editor-toolbar';
import { CollaborationCursorV3 } from '@/features/collaboration/collab-cursor';
import { useContentSnapshot } from '@/features/documents/use-content-snapshot';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface TiptapEditorProps {
  documentId: string;
  provider: WebsocketProvider;
  ydoc: Y.Doc;
  userColor: string;
  readOnly: boolean;
  initialContent?: string;
}

export const TiptapEditor = ({
  documentId,
  provider,
  ydoc,
  userColor,
  readOnly,
  initialContent,
}: TiptapEditorProps) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          // Collaboration already bundles yUndoPlugin for undo/redo.
          // The v3 option name is `undoRedo`, not `history`.
          undoRedo: false,
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Placeholder.configure({
          placeholder: readOnly
            ? 'This document is read-only'
            : 'Start typing...',
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursorV3.configure({
          provider,
          user: {
            name: provider.awareness.getLocalState()?.user?.name || 'Anonymous',
            color: userColor,
          },
        }),
      ],
      editable: !readOnly,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[calc(100vh-180px)] px-4 py-6 sm:px-8 sm:py-8',
        },
      },
      immediatelyRender: false,
    },
    []
  );

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  // Persist a derived HTML snapshot for thumbnails. Yjs stays the source of truth.
  useContentSnapshot({
    documentId,
    editor,
    ydoc,
    enabled: !readOnly,
    initialContent,
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
      {!readOnly && <EditorToolbar editor={editor} />}
      <div className="bg-card border-border flex-1 border-x">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

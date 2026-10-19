'use client';

import { useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { useQueryClient } from '@tanstack/react-query';
import * as Y from 'yjs';
import { documentKeys } from './queries';

interface UseContentSnapshotOptions {
  documentId: string;
  editor: Editor | null;
  ydoc: Y.Doc;
  enabled: boolean;
  // last snapshot we kno is saved on the server, so we dont write the
  // same thing again when the doc opens
  initialContent?: string;
}

const DEBOUNCE_MS = 1500;

// pushes a html snapshot of the yjs doc to the rest endpoint.
// yjs is the source of truth, documents.content is only writen from here
// and is only read for thumbnails.
export const useContentSnapshot = ({
  documentId,
  editor,
  ydoc,
  enabled,
  initialContent,
}: UseContentSnapshotOptions) => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushedRef = useRef(initialContent ?? '');
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (!editor || !enabled) return;

    const push = (keepalive = false) => {
      dirtyRef.current = false;

      const html = editor.getHTML();
      if (html === lastPushedRef.current) return;
      lastPushedRef.current = html;

      fetch(`/api/documents/${documentId}/autosave`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: html }),
        keepalive,
      })
        .then((response) => {
          if (response.ok) {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
          }
        })
        .catch(() => {
          // let a later update or flush retry
          lastPushedRef.current = '';
        });
    };

    const schedule = () => {
      dirtyRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        push();
      }, DEBOUNCE_MS);
    };

    const flush = () => {
      if (!dirtyRef.current) return;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      push(true);
    };

    ydoc.on('update', schedule);
    window.addEventListener('pagehide', flush);

    return () => {
      ydoc.off('update', schedule);
      window.removeEventListener('pagehide', flush);
      flush();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [documentId, editor, ydoc, enabled, queryClient]);
};

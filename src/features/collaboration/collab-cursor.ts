import { Extension } from '@tiptap/core';
import { yCursorPlugin } from '@tiptap/y-tiptap';
import type { WebsocketProvider } from 'y-websocket';

export interface CursorUser {
  name: string;
  color: string;
}

export const CollaborationCursorV3 = Extension.create<{
  provider: WebsocketProvider | null;
  user: CursorUser;
}>({
  name: 'collaborationCursorV3',

  addOptions() {
    return {
      provider: null,
      user: {
        name: 'Anonymous',
        color: '#958DF1',
      },
    };
  },

  addProseMirrorPlugins() {
    const provider = this.options.provider;
    if (!provider) return [];

    provider.awareness.setLocalStateField('user', this.options.user);

    const renderCursor = (user: CursorUser) => {
      const caret = document.createElement('span');
      caret.classList.add('collaboration-cursor__caret');
      caret.setAttribute('style', `border-color: ${user.color}`);
      const label = document.createElement('div');
      label.classList.add('collaboration-cursor__label');
      label.setAttribute('style', `background-color: ${user.color}`);
      label.textContent = user.name;
      caret.appendChild(label);
      return caret;
    };

    return [
      yCursorPlugin(provider.awareness, {
        cursorBuilder: renderCursor,
      }),
    ];
  },
});

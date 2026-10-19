import { useEffect, useMemo, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const colors = [
  '#958DF1',
  '#F98181',
  '#FBBC88',
  '#FAF594',
  '#70CFF8',
  '#94FADB',
  '#B9F18D',
];

export const useCollaboration = (docId: string) => {
  // memoize the doc so it doesn't get recreated on renders
  const ydoc = useMemo(() => new Y.Doc(), []);

  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!docId) return;

    // pick a random cursor color for this session
    const color = colors[Math.floor(Math.random() * colors.length)];

    // get user data from the cookies
    const getCookie = (name: string) => {
      // browser cookie parser
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };
    const email = getCookie('user_email')
      ? decodeURIComponent(getCookie('user_email')!)
      : 'Anonymous';
    const name = getCookie('user_name')
      ? decodeURIComponent(getCookie('user_name')!)
      : email.split('@')[0];

    // connect to backend
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

    const newProvider = new WebsocketProvider(wsUrl, docId, ydoc, {
      params: {
        // authenticates the connection with token
        token: getCookie('ws_token') || '',
      },
    });

    // set awareness
    newProvider.awareness.setLocalStateField('user', {
      name: name,
      color: color,
    });

    const handleStatus = ({ status }: { status: string }) => {
      setConnected(status === 'connected');
    };
    newProvider.on('status', handleStatus);
    // expose the connected external websocket provider to the component.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProvider(newProvider);

    return () => {
      newProvider.off('status', handleStatus);
      newProvider.destroy();
    };
  }, [docId, ydoc]);

  // the local cursor color is set on awareness when the provider connects
  const localUser = provider?.awareness.getLocalState()?.user as
    | { color?: string }
    | undefined;

  return {
    provider,
    ydoc,
    userColor: localUser?.color ?? colors[0],
    connected,
  };
};

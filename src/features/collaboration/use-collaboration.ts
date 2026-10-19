import { useEffect, useMemo, useState } from 'react';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';


const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D'];

export const useCollaboration = (docId: string) => {

    // generate random color
    const randomColor = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);

    // memoize the doc so it doesn't get recreated on renders
    const ydoc = useMemo(() => new Y.Doc(), []);

    const [provider, setProvider] = useState<WebsocketProvider | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!docId) return;

        // get user data from the cookies
        const getCookie = (name: string) => {
            // browser cookie parser
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        };
        const email = getCookie("user_email") ? decodeURIComponent(getCookie("user_email")!) : "Anonymous";
        const name = getCookie("user_name") ? decodeURIComponent(getCookie("user_name")!) : email.split("@")[0];

        // connect to backend
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

        const newProvider = new WebsocketProvider(
            wsUrl,
            docId,
            ydoc,
            {
                params: {
                    // authenticates the connection with token
                    token: getCookie("ws_token") || "",
                },
            }
        );

        // set awareness
        newProvider.awareness.setLocalStateField('user', {
            name: name,
            color: randomColor,
        });

        const handleStatus = ({ status }: { status: string }) => {
            setConnected(status === "connected");
        };
        newProvider.on("status", handleStatus);
        setConnected(newProvider.ws?.readyState === WebSocket.OPEN);
        setProvider(newProvider);

        return () => {
            newProvider.off("status", handleStatus);
            newProvider.destroy();
        };
    }, [docId, ydoc, randomColor]);

    return { provider, ydoc, userColor: randomColor, connected };
};

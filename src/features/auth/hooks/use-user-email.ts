'use client';

import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

function getSnapshot() {
  const match = document.cookie.match(/(?:^|;\s*)user_email=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getServerSnapshot() {
  return null;
}

export function useUserEmail() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

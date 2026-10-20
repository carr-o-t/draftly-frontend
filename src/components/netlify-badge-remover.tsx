'use client';

import { useEffect } from 'react';

// netlify injects a "powered by netlify" badge iframe that sits on top of the
// bottom nav on mobile
// hide it with this component
export function NetlifyBadgeRemover() {
  useEffect(() => {
    const removeBadge = () => {
      document.getElementById('nl-badge-frame')?.remove();
    };

    removeBadge();

    const observer = new MutationObserver(removeBadge);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}

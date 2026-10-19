'use client';

import { Suspense } from 'react';
import { DocumentList } from '@/features/documents/components/document-list';

export default function SharedPage() {
  return (
    <Suspense fallback={null}>
      <DocumentList />
    </Suspense>
  );
}

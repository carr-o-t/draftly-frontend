'use client';

import { Suspense } from 'react';
import { DocumentList } from '@/features/documents/components/document-list';

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DocumentList />
    </Suspense>
  );
}

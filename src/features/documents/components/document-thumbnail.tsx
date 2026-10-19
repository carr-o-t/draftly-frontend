'use client';

import { cn } from '@/lib/utils';

interface DocumentThumbnailProps {
  content: string;
  className?: string;
}

export function DocumentThumbnail({
  content,
  className,
}: DocumentThumbnailProps) {
  // Basic sanitization/safeguard: if content is empty, show placeholder
  const isEmpty = !content || content === '<p></p>';

  // We scale down a 800px wide "virtual" page to fit container
  // Assuming container is roughly ~300px wide, scale ~0.4
  // But better to use container queries or just fixed usage.
  // For a card thumbnail of h-32 (128px), lets target a view.

  return (
    <div
      className={cn(
        'pointer-events-none relative h-full w-full overflow-hidden rounded-t-md bg-white select-none',
        'border-muted/20 border-b',
        className
      )}
      aria-hidden="true"
    >
      {!isEmpty ? (
        <div className="absolute top-0 left-0 h-[200%] w-[200%] origin-top-left scale-50 bg-white p-8">
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-[10px] leading-relaxed text-slate-600"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <div className="bg-muted/10 flex h-full w-full flex-col items-center justify-center space-y-2 p-4 opacity-40">
          <div className="bg-foreground/10 h-2 w-3/4 rounded-full" />
          <div className="bg-foreground/10 h-2 w-1/2 rounded-full" />
          <div className="bg-foreground/10 h-2 w-2/3 rounded-full" />
        </div>
      )}

      {/* Overlay to ensure it's not interactive and adds a subtle depth feeling */}
      <div className="absolute inset-0 bg-stone-900/2" />
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface DocumentThumbnailProps {
    content: string;
    className?: string;
}

export function DocumentThumbnail({ content, className }: DocumentThumbnailProps) {
    // Basic sanitization/safeguard: if content is empty, show placeholder
    const isEmpty = !content || content === "<p></p>";

    // We scale down a 800px wide "virtual" page to fit container
    // Assuming container is roughly ~300px wide, scale ~0.4
    // But better to use container queries or just fixed usage.
    // For a card thumbnail of h-32 (128px), lets target a view.

    return (
        <div
            className={cn(
                "relative w-full h-full bg-white overflow-hidden select-none pointer-events-none rounded-t-md",
                "border-b border-muted/20",
                className
            )}
            aria-hidden="true"
        >
            {!isEmpty ? (
                <div
                    className="absolute top-0 left-0 origin-top-left w-[200%] h-[200%] p-8 bg-white scale-50"
                >
                    <div
                        className="prose prose-sm max-w-none dark:prose-invert text-[10px] leading-relaxed text-slate-600"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/10 p-4 space-y-2 opacity-40">
                    <div className="w-3/4 h-2 bg-foreground/10 rounded-full" />
                    <div className="w-1/2 h-2 bg-foreground/10 rounded-full" />
                    <div className="w-2/3 h-2 bg-foreground/10 rounded-full" />
                </div>
            )}

            {/* Overlay to ensure it's not interactive and adds a subtle depth feeling */}
            <div className="absolute inset-0 bg-stone-900/2" />
        </div>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, FileText, CheckCircle2, ArrowLeft, Loader2, EyeIcon, Edit } from "lucide-react";
import Link from "next/link";
import { useRequestAccess } from "../mutations";
import { cn } from "@/lib/utils";

interface RequestAccessCardProps {
    documentId: string;
    documentTitle?: string;
}

export function RequestAccessCard({ documentId, documentTitle = "Unknown Document" }: RequestAccessCardProps) {
    const [selectedRole, setSelectedRole] = useState<"viewer" | "editor" | null>(null);
    const { mutate: requestAccess, isPending, isSuccess } = useRequestAccess(documentId);

    const handleSubmit = () => {
        if (!selectedRole) return;
        requestAccess({ role: selectedRole });
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-background">
                <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center text-success">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-2">Request Sent</h2>
                    <p className="text-sm text-muted-foreground mb-8">
                        The document owner has been notified. You'll receive access once they approve your request.
                    </p>

                    <Button asChild variant="outline" className="w-full">
                        <Link href="/documents">Back to Documents</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md rounded-xl border bg-card p-6 sm:p-8 shadow-sm">
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Lock className="h-6 w-6" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Request Access</h1>
                    <p className="text-sm text-muted-foreground">
                        You don't have permission to view this document
                    </p>
                </div>

                {/* <div className="bg-muted/30 rounded-lg p-4 mb-6 flex items-center justify-center gap-2 border border-border/50">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Document</span>
                    <div className="w-px h-4 bg-border" />
                    <span className="font-medium text-foreground truncate max-w-[200px]">{documentId}</span>
                </div> */}

                <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium text-foreground">Request access as</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setSelectedRole("viewer")}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:bg-muted/50 focus:outline-none",
                                selectedRole === "viewer"
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-muted bg-card text-muted-foreground hover:border-primary/50"
                            )}
                        >
                            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center mb-2", selectedRole === "viewer" ? "bg-primary/20" : "bg-muted")}>
                                <EyeIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-sm">Viewer</span>
                            <span className="text-[10px] opacity-70">Read only</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedRole("editor")}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:bg-muted/50 focus:outline-none",
                                selectedRole === "editor"
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-muted bg-card text-muted-foreground hover:border-primary/50"
                            )}
                        >
                            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center mb-2", selectedRole === "editor" ? "bg-primary/20" : "bg-muted")}>
                                <Edit className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-sm">Editor</span>
                            <span className="text-[10px] opacity-70">Can edit</span>
                        </button>
                    </div>
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={!selectedRole || isPending}
                    className="w-full mb-4"
                    size="lg"
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Request Access
                </Button>

                <div className="text-center">
                    <Link
                        href="/documents"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back to Documents
                    </Link>
                </div>
            </div>
        </div>
    );
}

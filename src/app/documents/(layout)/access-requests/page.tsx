"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHandleRequest, useRevokeAccess } from "@/features/documents/mutations";
import { useAccessRequests } from "@/features/documents/queries";
import { AccessRequest } from "@/features/documents/types";
import { format } from "date-fns";
import { Check, FileText, Loader2, RotateCcw, User, X } from "lucide-react";
import { useMemo } from "react";

export default function AccessRequestsPage() {
    const { data, isLoading } = useAccessRequests();

    const requests = useMemo(() => data?.data.received || [], [data]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
                <div className="bg-muted/20 p-4 rounded-full mb-4">
                    <User className="w-10 h-10 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No pending requests</h3>
                <p className="text-sm">You&apos;re all caught up!</p>
            </div>
        );
    }

    const pendingCount = requests.filter(r => r.status === "pending").length;

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Access Requests</h1>
                <p className="text-sm text-muted-foreground">
                    {pendingCount} pending requests
                </p>
            </div>

            <div className="space-y-4">
                {requests.map((request) => (
                    <RequestItem key={request.id} request={request} />
                ))}
            </div>
        </div>
    );
}

function RequestItem({ request }: { request: AccessRequest }) {
    // We need document ID to handle request. Backend response now has it.
    const { mutate: handleRequest, isPending: isHandling } = useHandleRequest(request.document_id);
    const { mutate: revokeAccess, isPending: isRevoking } = useRevokeAccess(request.document_id);

    const onApprove = () => {
        handleRequest({
            requestId: request.id,
            data: {
                action: "approved",
                role: request.role
            }
        });
    };

    const onReject = () => {
        handleRequest({
            requestId: request.id,
            data: { action: "rejected" }
        });
    };

    const onRevoke = () => {
        revokeAccess(request.requester_id);
    };

    const StatusBadge = () => {
        if (request.status === "approved") {
            return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1">Approved</Badge>;
        }
        if (request.status === "rejected") {
            return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 py-1">Rejected</Badge>;
        }
        return null; // Pending has actions
    };

    console.log(request)
    const dateLabel = useMemo(() => {
        const requestDate = request.created_at?.split(" ")?.[0] || "";
        const date = new Date(requestDate);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return format(date, "MMM d, yyyy");
    }, [request.created_at]);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-card shadow-sm transition-all hover:shadow-md gap-4">
            <div className="flex items-start gap-4">
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded bg-green-50 text-green-600">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-base leading-none mb-1">{request.doc_title || "Unknown Document"}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                        <User className="w-3 h-3" />
                        Request from <span className="font-medium text-foreground">{request.requester_email || "Unknown User"}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mx-1" />
                        {dateLabel}
                        {request.role && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mx-1" />
                                <span className="capitalize text-xs font-medium bg-secondary px-1.5 py-0.5 rounded">{request.role}</span>
                            </>
                        )}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
                {request.status === "pending" ? (
                    <>
                        <Button
                            onClick={onApprove}
                            disabled={isHandling}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white gap-1.5 h-9"
                        >
                            {isHandling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Approve
                        </Button>
                        <Button
                            onClick={onReject}
                            disabled={isHandling}
                            size="sm"
                            variant="outline"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 gap-1.5 h-9"
                        >
                            <X className="w-4 h-4" />
                            Reject
                        </Button>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <StatusBadge />
                        {request.status === "approved" && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:bg-destructive/5 border-destructive/20 h-8 gap-1.5"
                                onClick={onRevoke}
                            // disabled
                            >
                                <RotateCcw className="w-3 h-3" />
                                Revoke
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export interface Document {
    id: string;
    title: string;
    content: string;
    role: "owner" | "editor" | "viewer";
    created_at: string;
    updated_at: string;
}

export interface DocumentListResponse {
    success: boolean;
    data: {
        my_documents: Document[];
        shared_with_me: Document[];
    };
}

export interface CreateDocumentRequest {
    title: string;
}

export interface UpdateDocumentRequest {
    title: string;
    content: string;
}

export interface InviteRequestItem {
    email: string;
    role: "viewer" | "editor";
}

export type InviteUserRequest = InviteRequestItem[];

export interface PendingInviteResponse {
    invited: Record<string, string>; // or similar based on backend response "invited" map
}

export interface Permission {
    user_id: string;
    email: string;
    name: string;
    role: string;
}

export interface AccessRequest {
    id: string;
    document_id: string;
    doc_title?: string;
    requester_id: string;
    requester_name?: string;
    role?: "viewer" | "editor";
    status: "pending" | "approved" | "rejected";
    created_at: string;
}

export interface HandleAccessRequest {
    action: "approved" | "rejected";
    role?: "viewer" | "editor";
}

export interface AccessTokenRequest {
    token: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

export interface AuthRequest {
    email: string;
    password?: string;
}

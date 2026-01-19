import { useMutation } from "@tanstack/react-query";
import { AuthRequest, AuthResponse } from "./types";
import { authKeys } from "./keys";

export const useLoginOrRegister = () => {
    return useMutation({
        mutationKey: authKeys.loginOrRegister(),
        mutationFn: async (credentials: AuthRequest): Promise<AuthResponse> => {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Authentication failed");
            }

            return response.json();
        },
    });
};

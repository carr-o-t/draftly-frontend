import { useRouter } from "next/navigation";
import { useState } from "react";

export const useSignOut = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const signOut = async () => {
        setIsLoading(true);
        try {
            await fetch("/api/auth/sign-out", {
                method: "POST",
            });
            router.push("/auth");
            router.refresh(); // Ensure server components re-run to see cleared cookies
        } catch (error) {
            console.error("Failed to sign out:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { signOut, isLoading };
};

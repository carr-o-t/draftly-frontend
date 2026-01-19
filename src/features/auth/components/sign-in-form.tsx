"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { useLoginOrRegister } from "../queries";

const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type SignInValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
    onToggleMode: () => void;
}

export const SignInForm = ({ onToggleMode }: SignInFormProps) => {
    const router = useRouter();
    const { mutate: login, isPending: isLoading } = useLoginOrRegister();

    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: SignInValues) => {
        login(data, {
            onSuccess: () => {
                // Handle success (e.g., redirect or update user state)
                console.log("Logged in successfully");
                router.push("/dashboard");
            },
            onError: (error) => {
                console.error("Login failed:", error);
                form.setError("root", { message: error.message });
            }
        });
    };

    return (
        <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
                <p className="text-muted-foreground">
                    Enter your credentials to access your documents
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <input
                                {...form.register("email")}
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="you@example.com"
                                type="email"
                            />
                        </div>
                        {form.formState.errors.email && (
                            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                Password
                            </label>
                            <button type="button" className="text-sm text-primary hover:underline" onClick={() => { }}>Forgot password?</button>
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <input
                                {...form.register("password")}
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="••••••••"
                                type="password"
                            />
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                </div>

                {form.formState.errors.root && (
                    <p className="text-sm text-destructive text-center">{form.formState.errors.root.message}</p>
                )}

                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In →
                </button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button className="font-medium text-primary hover:underline" onClick={onToggleMode}>
                    Sign up
                </button>
            </div>
        </div>
    );
};

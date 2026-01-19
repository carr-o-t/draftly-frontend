"use client";

import { useState } from "react";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";
import { FileText, Share2, Shield } from "lucide-react";

export const AuthScreen = () => {
    const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

    const toggleMode = () => {
        setMode((prev) => (prev === "signIn" ? "signUp" : "signIn"));
    };

    return (
        <div className="flex min-h-screen w-full bg-background text-foreground">
            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-sidebar-primary/10 dark:to-sidebar-primary/5 p-12 lg:p-20 relative overflow-hidden">
                {/* Radial gradient background effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="bg-primary p-2 rounded-lg">
                            <FileText className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">DocFlow</span>
                    </div>

                    <h1 className="text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6">
                        Collaborate on<br />
                        <span className="text-primary">documents</span><br />
                        seamlessly.
                    </h1>

                    <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
                        Create, share, and collaborate on documents with your
                        team in real-time. Simple, secure, and beautifully
                        designed.
                    </p>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-full border border-border/50 text-sm font-medium text-foreground shadow-sm">
                            <FileText className="h-4 w-4 text-primary" />
                            Real-time editing
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-full border border-border/50 text-sm font-medium text-foreground shadow-sm">
                            <Share2 className="h-4 w-4 text-primary" />
                            Easy sharing
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-full border border-border/50 text-sm font-medium text-foreground shadow-sm">
                            <Shield className="h-4 w-4 text-primary" />
                            Access control
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                {mode === "signIn" ? (
                    <SignInForm onToggleMode={toggleMode} />
                ) : (
                    <SignUpForm onToggleMode={toggleMode} />
                )}
            </div>
        </div>
    );
};

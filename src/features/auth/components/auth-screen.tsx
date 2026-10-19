'use client';

import { useState } from 'react';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { FileText, Share2, Shield } from 'lucide-react';

export const AuthScreen = () => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');

  const toggleMode = () => {
    setMode((prev) => (prev === 'signIn' ? 'signUp' : 'signIn'));
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full">
      {/* Left Side - Branding & Features */}
      <div className="dark:from-sidebar-primary/10 dark:to-sidebar-primary/5 relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-green-50 to-green-100 p-12 lg:flex lg:p-20">
        {/* Radial gradient background effect */}
        <div className="bg-primary/20 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <div className="mb-12 flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <FileText className="text-primary-foreground h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">DocFlow</span>
          </div>

          <h1 className="text-foreground mb-6 text-5xl leading-[1.15] font-extrabold tracking-tight">
            Collaborate on
            <br />
            <span className="text-primary">documents</span>
            <br />
            seamlessly.
          </h1>

          <p className="text-muted-foreground mb-12 text-lg leading-relaxed">
            Create, share, and collaborate on documents with your team in
            real-time. Simple, secure, and beautifully designed.
          </p>

          <div className="flex gap-4">
            <div className="border-border/50 text-foreground flex items-center gap-2 rounded-full border bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm dark:bg-black/20">
              <FileText className="text-primary h-4 w-4" />
              Real-time editing
            </div>
            <div className="border-border/50 text-foreground flex items-center gap-2 rounded-full border bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm dark:bg-black/20">
              <Share2 className="text-primary h-4 w-4" />
              Easy sharing
            </div>
            <div className="border-border/50 text-foreground flex items-center gap-2 rounded-full border bg-white/60 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm dark:bg-black/20">
              <Shield className="text-primary h-4 w-4" />
              Access control
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="bg-background flex flex-1 items-center justify-center p-8">
        {mode === 'signIn' ? (
          <SignInForm onToggleMode={toggleMode} />
        ) : (
          <SignUpForm onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  );
};

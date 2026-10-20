'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';
import { DEVELOPER_NAME, SOCIAL_LINKS } from '@/constants';

// mobile only, the desktop sidebar already shows these. sits at the bottom of
// the list pages so the links are reachable without opening the account menu.
export function MobileFooter() {
  return (
    <footer className="mt-8 flex flex-col items-center gap-3 border-t pt-6 pb-2 md:hidden">
      <div className="flex items-center gap-1">
        <Link
          href={SOCIAL_LINKS.GITHUB}
          target="_blank"
          aria-label="GitHub"
          className="text-muted-foreground hover:text-foreground p-2 transition-colors"
        >
          <Github className="h-4 w-4" />
        </Link>
        <Link
          href={SOCIAL_LINKS.LINKEDIN}
          target="_blank"
          aria-label="LinkedIn"
          className="text-muted-foreground hover:text-foreground p-2 transition-colors"
        >
          <Linkedin className="h-4 w-4" />
        </Link>
        <Link
          href={`mailto:${SOCIAL_LINKS.MAIL}`}
          aria-label="Email"
          className="text-muted-foreground hover:text-foreground p-2 transition-colors"
        >
          <Mail className="h-4 w-4" />
        </Link>
        <Link
          href={SOCIAL_LINKS.PORTFOLIO}
          target="_blank"
          aria-label="Portfolio"
          className="text-muted-foreground hover:text-foreground p-2 transition-colors"
        >
          <Globe className="h-4 w-4" />
        </Link>
      </div>
      <p className="text-muted-foreground text-xs">
        A project by{' '}
        <Link
          href={SOCIAL_LINKS.PORTFOLIO}
          target="_blank"
          className="text-primary font-semibold hover:underline hover:underline-offset-1"
        >
          {DEVELOPER_NAME}
        </Link>
      </p>
    </footer>
  );
}

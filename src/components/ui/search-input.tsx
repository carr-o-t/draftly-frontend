'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <input
        type="search"
        placeholder="Search documents..."
        className="bg-background focus:ring-primary h-9 w-full rounded-md border px-3 pl-8 text-sm focus:ring-1 focus:outline-none md:w-2/3 lg:w-[320px]"
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}

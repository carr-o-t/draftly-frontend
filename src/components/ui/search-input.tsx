"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
                type="search"
                placeholder="Search documents..."
                className="w-full bg-background pl-8 md:w-2/3 lg:w-[320px] border rounded-md h-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary px-3"
                defaultValue={searchParams.get("search")?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}

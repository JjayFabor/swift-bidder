import { router } from "@inertiajs/react";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext
  } from "@/components/ui/pagination";

export default function PaginationControls({ links }) {
    const previous = links[0];
    const next = links[links.length - 1];

    const visit = (event, url) => {
        event.preventDefault();
        router.visit(url, { preserveScroll: true });
    };

    return (
        <div className="flex justify-end mt-4">
            <Pagination>
                <PaginationContent>
                    {previous?.url && (
                        <PaginationItem>
                            <PaginationPrevious
                                href={previous.url}
                                onClick={(event) => visit(event, previous.url)}
                            />
                        </PaginationItem>
                    )}
                    {links.slice(1, -1).map((link) => (
                        <PaginationItem key={link.label}>
                            <PaginationLink
                                href={link.url}
                                isActive={link.active}
                                onClick={(event) => visit(event, link.url)}
                            >
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {next?.url && (
                        <PaginationItem>
                            <PaginationNext
                                href={next.url}
                                onClick={(event) => visit(event, next.url)}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}

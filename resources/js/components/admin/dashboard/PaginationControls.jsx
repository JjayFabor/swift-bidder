import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext
  } from "@/components/ui/pagination";

export default function PaginationControls({ links }) {
    return (
        <div className="flex justify-end mt-4">
            <Pagination>
                <PaginationContent>
                    {links[0]?.url && (
                        <PaginationItem>
                            <PaginationPrevious
                                href={links[0].url}
                                onClick={() => Inertia.visit(links[0].url)}
                            />
                        </PaginationItem>
                    )}
                    {links.slice(1, -1).map((link) => (
                        <PaginationItem key={link.label}>
                            <PaginationLink
                                href={link.url}
                                isActive={link.active}
                                onClick={() => Inertia.visit(link.url)}
                            >
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {links[links.length - 1]?.url && (
                        <PaginationItem>
                            <PaginationNext
                                href={links[links.length - 1].url}
                                onClick={() => Inertia.visit(link.url)}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
}

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function ProductPagination({ totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Show a few page numbers
  const renderPageNumbers = () => {
    const pages = [];
    // Always show first page
    if (currentPage > 2) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink href={createPageURL(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 3) {
        pages.push(<PaginationEllipsis key="start-ellipsis" />);
      }
    }

    // Show current page, and one before/after
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink href={createPageURL(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show last page
    if (currentPage < totalPages - 2) {
      pages.push(<PaginationEllipsis key="end-ellipsis" />);
    }
    if (currentPage < totalPages - 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={createPageURL(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

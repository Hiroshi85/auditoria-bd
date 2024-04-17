import usePagination from "@/hooks/results/pagination";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";

interface Props {
    prevUrl: string | null;
    nextUrl: string | null;
    total_pages: number;
    currentPage: number;
    page_query?: string
}

export default function Paginacion({
    prevUrl,
    nextUrl,
    total_pages,
    currentPage,
    page_query = "p"
  }: Props) {
    const { handleNextPrevPage, setQuery } = usePagination();
    const pages_to_show = 10;
    const sRange =
      currentPage > total_pages - pages_to_show
        ? Math.max(1, total_pages - pages_to_show )
        : Math.max(1, currentPage, currentPage - pages_to_show + 1);
    const eRange = Math.min(total_pages + 1, currentPage + pages_to_show);
  
    return (
      <Pagination className="sticky bottom-0 bg-white rounded-md p-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handleNextPrevPage(prevUrl)}
              isActive={prevUrl !== null}
            />
          </PaginationItem>
          {sRange > 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {Array.from({ length: eRange - sRange }, (_, i) => i + sRange).map(
            (page) => {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    className="cursor-pointer"
                    isActive={page === currentPage}
                    onClick={() => setQuery(page_query, page.toString())}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
          )}
          {eRange < total_pages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => handleNextPrevPage(nextUrl)}
              isActive={nextUrl !== null}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }
  
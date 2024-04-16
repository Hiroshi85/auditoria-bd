import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

function usePagination() {
  
  const router = useRouter();
  const pathname = usePathname();

  const pageSearchParams = useSearchParams();
  const queryClient = useQueryClient();

  const table = pageSearchParams.get("table");

 
  function handleNextPrevPage(next: string | null) {
      if (!next) return;
      const nextParams = get_query_params(next);
      router.replace(`${pathname}?${nextParams}`, { scroll: false });
  }

  function get_query_params(url: string) {
    const params = url.split("?")[1];
    let newParams = new URLSearchParams(params);
    if (table && !newParams.has("table")) newParams.append("table", table);

    return newParams.toString();
  }

  return {
    handleNextPrevPage
  };
}

export default usePagination;

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function usePagination() {
  
  const router = useRouter();
  const pathname = usePathname();

  const pageSearchParams = useSearchParams();

  const table = pageSearchParams.get("table");

  // region Siguiente - Previo
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

  // region Construct queries

  function setQuery(page_query : string, value: string) {
    // page_query = "missing_page", page = 2
    
    const newParams = new URLSearchParams(pageSearchParams.toString());
    if (newParams.has(page_query)) {
      value !== "" ? newParams.set(page_query, value) : newParams.delete(page_query)
    }else {
      value!== "" && newParams.append(page_query, value)
    }
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }

  return {
    pageSearchParams,
    handleNextPrevPage,
    setQuery
  };
}

export default usePagination;

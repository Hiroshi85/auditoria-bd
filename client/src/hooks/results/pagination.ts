import { SearchParam } from "@/types/search-params";
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

  function setSearchParams(params: SearchParam[]) {
    // page_query = "missing_page", page = 2
    
    const newParams = new URLSearchParams(pageSearchParams.toString());
    
    params.forEach(({ key, value }) => {
      if (newParams.has(key)) {
        value !== "" ? newParams.set(key, value) : newParams.delete(key)
      }else {
        value!== "" && newParams.append(key, value)
      }
    });

    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  }

  return {
    pageSearchParams,
    handleNextPrevPage,
    setSearchParams
  };
}

export default usePagination;

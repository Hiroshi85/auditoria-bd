"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import usePagination from "@/hooks/results/pagination";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Search } from "lucide-react";

interface Props {
  page_size_query?: string;
  search_query?: string;
  registers_count: number;
  strict_query?: string;
  page_query?: string; // prevenir invalid page al filtrar los resultados
}
function FiltroResultado({
  registers_count,
  page_query = "p",
  page_size_query = "page_size",
  search_query = "search",
  strict_query = "strict",
}: Props) {
  const { setSearchParams } = usePagination();

  const schema = z.object({
    page_size: z.coerce.number().min(1).max(500),
    search: z.string().optional(),
    strict: z.boolean().default(false).optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      page_size: 25,
      search: "",
    },
    resolver: zodResolver(schema),
  });

  const watchPageSize = form.watch("page_size");

  useEffect(() => {
    const validatedPageSize = schema.shape.page_size.safeParse(watchPageSize);
    if (validatedPageSize.success) {
      console.log("Valid page size");
      form.clearErrors("page_size");
      const timeout = setTimeout(() => {
        // Prevenir error invalid page
        setSearchParams([
          { key: page_size_query, value: watchPageSize.toString() },
          { key: page_query, value: "1" },
        ]);
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      form.setError("page_size", {
        message: "El limite de número de registros es un entero entre 1 y 500",
      });
    }
  }, [watchPageSize]);

  const watchSearch = form.watch("search");
  useEffect(() => {
    if (watchSearch !== undefined) {
      const timeout = setTimeout(() => {
        setSearchParams([
          { key: search_query, value: watchSearch },
          { key: page_query, value: "1"}
        ]);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [watchSearch]);

  const watchStrict = form.watch("strict");
  useEffect(() => {
    if (watchStrict !== undefined) {
      setSearchParams([
        { key: strict_query, value: watchStrict.toString() },
        { key: page_query, value: "1" }
      ])
    }
  }, [watchStrict]);

  return (
    <Form {...form}>
      <form action="" className="w-fit flex gap-4 items-center">
        <FormField
          control={form.control}
          name="page_size"
          render={({ field }) => (
            <FormItem className="text-sm">
              <FormControl>
                <div className="flex gap-2 items-center">
                  <span className="shrink-0">Mostrando un máximo de </span>
                  <Input
                    type="number"
                    className="w-[100px] focus-visible:ring-1 focus-visible:ring-offset-0"
                    {...field}
                  />
                  <span> de {registers_count}</span>
                </div>
              </FormControl>
              <div className="max-w-[320px] h-[20px] text-xs">
                <FormMessage className="text-xs leading-tight tracking-tighter" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-center rounded-lg pl-2 bg-accent">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <Input
                    type="text"
                    placeholder="Buscar"
                    className="w-[300px] focus-visible:ring-1 focus-visible:ring-offset-0"
                    {...field}
                  />
                </div>
              </FormControl>
              <div className="max-w-[320px] h-[20px] text-xs">
                <FormMessage className="text-xs leading-tight tracking-tighter" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="strict"
          render={({ field }) => (
            <FormItem className="flex self-start items-center space-x-3 space-y-0 rounded-md border p-2 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-light">
                  Coincidencia exacta
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default FiltroResultado;

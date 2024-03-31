"use client";
import { z } from "zod";
import { PersonalizadasFormSchema } from "./form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useTable } from "../../../partials/tables.context";
import { useConnectionDatabase } from "@/providers/connection";

import ColumnSuggestions from "./column-suggestions";

export default function CustomExceptionForm() {
  const params = useSearchParams();
  const table = params.get("table") ?? "";
  const { id: connectionId } = useConnectionDatabase();
  const { data, isError, isLoading } = useTable(table, connectionId);

  const form = useForm<z.infer<typeof PersonalizadasFormSchema>>({
    defaultValues: {
      task_name: "",
      columns: "",
      conditions: "",
    },
    resolver: zodResolver(PersonalizadasFormSchema),
  });

  if (isLoading) {
    return <p> Cargando... </p>;
  }
  if (isError) {
    return <p className="text-center">Error al cargar la tabla</p>;
  }

  function onSubmit(data: z.infer<typeof PersonalizadasFormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <div className="">
          <FormField
            control={form.control}
            name="task_name"
            render={({ field }) => (
              <FormItem className="w-fit">
                <FormLabel>Nombre de la tarea</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Excepción personalizada 1"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <div className="min-h-[20px]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-1">
          <FormField
            control={form.control}
            name="columns"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex gap-4">
                  <FormLabel className="flex items-center">SELECT</FormLabel>
                   <ColumnSuggestions form={form} columns={data?.columns} />
                </div>
                <FormControl>
                  <div className="grid w-full gap-1.5">
                    <Textarea
                      placeholder="*"
                      className="h-[60px] font-mono"
                      {...field}
                    />
                    <p className="text-sm text-muted-foreground uppercase">
                      from {table}
                    </p>
                  </div>
                </FormControl>
                <div className="min-h-[0px]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conditions"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="grid w-full gap-1.5">
                    <Textarea
                      placeholder="WHERE COLUMNA = 'VALOR'"
                      className="h-[60px] font-mono"
                      {...field}
                    />
                    <p className="text-sm text-muted-foreground">
                      No está permitido INSERT, UPDATE, DROP, DELETE, TRUNCATE,
                      ALTER, CREATE, EXECUTE, CALL GRANT
                    </p>
                  </div>
                </FormControl>
                <div className="min-h-[20px]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Ejecutar</Button>
      </form>
    </Form>
  );
}

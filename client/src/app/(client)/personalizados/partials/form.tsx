"use client";
import { z } from "zod";
import { PersonalizadasFormSchema } from "./schema";
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

export default function CustomExceptionForm() {
  const params = useSearchParams();
  const table = params.get("table") ?? "";

  const form = useForm<z.infer<typeof PersonalizadasFormSchema>>({
    resolver: zodResolver(PersonalizadasFormSchema),
  });

  function onSubmit(data: z.infer<typeof PersonalizadasFormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="task_name"
          render={({ field }) => (
            <FormItem className="w-fit">
              <FormLabel>Ejemplo de secuencia</FormLabel>
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

        <FormField
          control={form.control}
          name="script"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Script</FormLabel>
              <FormControl>
                <div className="grid w-full gap-1.5">
                  <Textarea
                    placeholder="SELECT * FROM <TABLA>"
                    className="min-h-[165px] font-mono"
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
      </form>
    </Form>
  );
}

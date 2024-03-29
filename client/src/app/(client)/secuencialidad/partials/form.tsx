"use client";
import { AllowedTypes } from "@/constants/secuenciales/columnas";
import { useTable } from "@/app/(client)/partials/tables.context";
import { useConnectionDatabase } from "@/providers/connection";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  table: string;
};

export default function SecuencialidadForm({ table }: Props) {
  const { id: connectionId } = useConnectionDatabase();
  const { data, isError, isLoading } = useTable(table, connectionId);

  const schema = z.object({
    column: z.string().nonempty(),
    example: z.string().optional(),
    frequency: z.string(),
    step: z.coerce.number(),
    max: z.coerce.string().optional(),
    min: z.coerce.string().optional(),
    min_date: z.date().optional(),
    max_date: z.date().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error</div>;
  //   console.log(data);

  const columns = data.columns.filter((column) =>
    AllowedTypes.includes(column.python_type.toLowerCase())
  );

  const watchColumn = form.watch("column");
  const selectedColumn = columns.find((column) => column.name === watchColumn);
  const selectedType = selectedColumn?.python_type ?? "no type selected";

  // Add inputs based on the selected type

  function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-wrap items-start gap-x-4 [&>*]:h-[100px] [&>*]:w-full md:[&>*]:w-[24%] w-full">
          <FormField
            control={form.control}
            name="column"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Columna</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {columns.map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="min-h-[20px]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          {/* ALFANUMÉRICOS VARCHAR */}
          {selectedType === "str" && (
            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ejemplo de secuencia</FormLabel>
                  <FormControl>
                    <Input placeholder="CAMPO00001" {...field} />
                  </FormControl>
                  <div className="min-h-[20px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          )}
          {(selectedType === "int" || selectedType === "str") && (
            <>
              <FormField
                control={form.control}
                name="min"
                render={({ field }) => (
                  <FormItem className="pt-[10px]">
                    <FormLabel className="flex justify-between">
                      <span>Valor mínimo</span>
                      <span className="text-gray-500">Opcional</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="1" type="number" min={1} {...field} />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max"
                render={({ field }) => (
                  <FormItem className="pt-[10px]">
                    <FormLabel className="flex justify-between">
                      <span>Valor mínimo</span>
                      <span className="text-gray-500">Opcional</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="1" type="number" min={1} {...field} />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="step"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paso</FormLabel>
                    <FormControl>
                      <Input placeholder="1" type="number" min={1} {...field} />
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Dates */}
          {(selectedType === "date" || selectedType === "datetime") && (
            <>
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Diaria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"D"}>Diaria</SelectItem>
                        <SelectItem value={"W"}>Semanal</SelectItem>
                        <SelectItem value={"MS"}>Inicio del mes</SelectItem>
                        <SelectItem value={"ME"}>Fin de mes</SelectItem>
                        <SelectItem value={"YS"}>Inicio del año</SelectItem>
                        <SelectItem value={"YE"}>Fin de año</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-[10px]">
                    <FormLabel>Fecha mínima</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d 'de' MMMM 'del' yyyy", {
                                locale: es,
                              })
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-[10px]">
                    <FormLabel>Fecha máxima</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "d 'de' MMMM 'del' yyyy", {
                                locale: es,
                              })
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        <Button type="submit">Ejecutar</Button>
      </form>
    </Form>
  );
}

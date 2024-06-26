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
import { SecuencialFormSchema } from "./schema";

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
import { useSecuencia } from "../../secuencia.context";
import { VerificarSecuenciaRequest } from "@/types/excepciones/secuencias";
import { obtenerTipoDatoSQL } from "@/helpers/tipos-datos";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type Props = {
  table: string;
};

export default function SecuencialidadForm({ table }: Props) {
  const { id: connectionId } = useConnectionDatabase();
  const { data, isError, isLoading } = useTable(table, connectionId);
  const [ selectedSQLType, setSelectedSQLType ] = useState<string>("");

  const { 
    selectedType, 
    setColumnType, 
    auditException, 
    clearResults, form} = useSecuencia();

  

  //TODO crear input skeletons
  if (isLoading) return <div className="animate-pulse">Cargando ...</div>;

  if (isError || !data)
    return <div className="text-sm text-red-500">No se pudieron cargar los datos del servidor</div>;

  const columns = data.columns.filter((column) =>
    AllowedTypes.includes(column.python_type.toLowerCase())
  );

  form.watch((value, { name }) => {
    if (name == "column") {
      const selectedColumn = columns.find((col) => col.name === value.column);
      if (selectedColumn === undefined) return;
      const selectedType = selectedColumn.python_type;
      setSelectedSQLType(obtenerTipoDatoSQL(selectedColumn.type)?.name || "");
      setColumnType(selectedType);
      clearResults();
      form.reset({
        column: value.column,
        column_type: selectedType,
        example: "",
        min: "",
        max: "",
        step: 1,
        static: true,
        frequency: "D",
        min_date: undefined,
        max_date: undefined,
      });
    }
  });

  function onSubmit(values: z.infer<typeof SecuencialFormSchema>) {
    if (selectedType === null) return;
    const min_value = values.min !== "" ? values.min : undefined;
    const max_value = values.max !== "" ? values.max : undefined;

    const reqData: VerificarSecuenciaRequest = {
      table: table,
      column: values.column,
      example: values.example !== "" ? values.example : undefined,
      min: selectedType === "date" ? values.min_date : min_value,
      max: selectedType === "date" ? values.max_date : max_value,
      step: values.step,
      static: values.static,
      frequency: values.frequency,
      sort: "none",
    };
    auditException(reqData, selectedType);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-wrap items-start gap-x-4 [&>*]:h-[100px] [&>*]:w-full md:[&>*]:w-[24%] w-full">
          <FormField
            control={form.control}
            name="column"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center py-0.5">
                  <FormLabel>Columna</FormLabel>
                  <Badge variant={"secondary"} className="text-[0.6rem] font-medium px-2">
                    {selectedSQLType}
                  </Badge>
                </div>
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
                      <Input placeholder="-" type="text" {...field} />
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
                      <span>Valor máximo</span>
                      <span className="text-gray-500">Opcional</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="-" type="text" {...field} />
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
                      <Input placeholder="1" type="text" {...field} />
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
                          <SelectValue placeholder="Seleccione una frecuencia" />
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
                    <FormLabel className="flex justify-between">
                      <span>Valor mínimo</span>
                      <span className="text-gray-500">{"(Opcional)"}</span>
                    </FormLabel>
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
                              <span>Elija una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={es}
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
                    <FormLabel className="flex justify-between">
                      <span>Valor máximo</span>
                      <span className="text-gray-500">{"(Opcional)"}</span>
                    </FormLabel>
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
                              <span>Elija una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          toYear={new Date().getFullYear()}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={es}
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
        <Button type="submit"> Ejecutar</Button>
      </form>
    </Form>
  );
}

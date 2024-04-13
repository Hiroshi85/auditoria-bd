"use client";
import { z } from "zod";
import { PersonalizadasFormSchema } from "./form-schema";
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
import { Button } from "@/components/ui/button";

import { useTable } from "../../../partials/tables.context";
import { useConnectionDatabase } from "@/providers/connection";
import { obtenerTipoDatoSQL } from "@/helpers/tipos-datos";

import ColumnSuggestions from "./column-suggestions";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-sqlserver";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";
import { usePersonalizadas } from "../../personalizados.context";
import { VerificarPersonalizadaRequest } from "@/types/excepciones/personalizadas";

import { SaveIcon, Paintbrush } from "lucide-react"
import EnterPromtp from "./prompt-select";

export default function CustomExceptionForm({ engine }: { engine: string }) {
  const { auditException, clearResults, form, saveQuery } = usePersonalizadas();
  const params = useSearchParams();
  const table = params.get("table") ?? "";

  const { id: connectionId } = useConnectionDatabase();
  const { data, isError, isLoading } = useTable(table, connectionId);

  form.setValue("table", table);

  const tables = [table];

  if (isLoading) {
    return <p> Cargando... </p>;
  }

  if (isError) {
    return <p className="text-center">Error al cargar la tabla</p>;
  }

  const onLoad = (editor: Ace.Editor) => {
    const customCompleter = {
      getCompletions: function (
        editor: Ace.Editor,
        session: Ace.EditSession,
        pos: Ace.Point,
        prefix: string,
        callback: any
      ) {
        if (!data) {
          return;
        }

        const columnCompletions = data.columns.map((column) => ({
          caption: column.name,
          value: column.name,
          meta: obtenerTipoDatoSQL(column.type)?.name ?? "Desconocido",
        }));

        const tableCompletions = tables.map((table) => ({
          caption: table,
          value: table,
          meta: "Table",
        }));

        callback(null, [...columnCompletions, ...tableCompletions]);
      },
    };
    //clear old completers
    editor.completers = editor.completers.filter(
      (completer) => completer !== customCompleter
    );

    editor.completers.push(customCompleter);
  };

  function onSubmit(data: z.infer<typeof PersonalizadasFormSchema>) {
    const request: VerificarPersonalizadaRequest = {
      table: table,
      query: data.query,
      name: data.name,
    };
    auditException(request);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="max-w-[500px]">
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
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="w-full">
              <div className="flex gap-4">
                <FormLabel className="flex items-center">Consulta</FormLabel>
                <ColumnSuggestions form={form} columns={data?.columns} />
                <EnterPromtp form={form} />
              </div>
              <FormControl>
                <div className="grid w-full gap-1.5">
                  <AceEditor
                    placeholder={`SELECT * FROM ${table}`}
                    fontSize={14}
                    mode={engine === "mysql" ? "mysql" : "sqlserver"}
                    theme="tomorrow"
                    width="100%"
                    height="250px"
                    className="rounded-md"
                    enableLiveAutocompletion={true}
                    enableBasicAutocompletion={true}
                    editorProps={{ $blockScrolling: true }}
                    onLoad={onLoad}
                    {...field}
                  />
                  <p className="text-sm text-muted-foreground">
                    No está permitido INSERT, UPDATE, DROP, DELETE, TRUNCATE,
                    ALTER, CREATE, EXECUTE, GRANT, etc.
                  </p>
                </div>
              </FormControl>
              <div className="min-h-[20px]">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit">Ejecutar</Button>
          <Button type="button" className="w-fit" onClick={
            () => saveQuery.mutate()
          }>
            <SaveIcon size={16} />
          </Button>
          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              form.reset();
              form.clearErrors();
              clearResults();
            }}
          >
            <Paintbrush size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";
import Spinner from "@/components/ui/spinner";
import { usePersonalizadas } from "../personalizados.context";
import { ResultContainer } from "@/components/ui/result-container";
import { DataTable } from "@/components/layout/table/table-details";
import { useConnectionDatabase } from "@/providers/connection";
import { Table2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomExceptionResults() {
  const { query, handlePreviousPage, handleNextPage } =
    usePersonalizadas();
  const { data, isPending, isError } = query;
  const connection = useConnectionDatabase();

  if (isPending)
    return (
      <ResultContainer>
        <Spinner />
      </ResultContainer>
    );
  if (isError)
    return (
      <ResultContainer type="error">
        Error al cargar los resultados
      </ResultContainer>
    );
  if (!data)
    return (
      <ResultContainer>
        Aquí se mostrarán los resultados de la ejecución
      </ResultContainer>
    );

  return data.result === "error" ? (
    <ResultContainer type="danger">
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-red-500">Error</h2>
        <p>
          <strong className="uppercase">{connection.engine + " "}</strong>
          {data.instance_error}
        </p>
        <p className="txt-sm">
          # {data.error_code} - {data.sql_error}
        </p>
        <h2 className="text-lg font-bold text-red-500">Query</h2>
        <p className="w-full bg-white rounded-md px-4 py-2 font-mono text-muted-foreground">
          {data.query}
        </p>
      </div>
    </ResultContainer>
  ) : (
    <ResultContainer type="ok">
      <header className="flex justify-between items-center space-x-2 space-y-3">
        <div className=" flex items-center gap-2">
          <Table2Icon size={20} />
          {data.table}
        </div>
        <div>
          {data.rows.count} filas en total limitado a {data.rows.page_size}
        </div>
      </header>
      <section>
        <DataTable
          columns={data.headers.map((header: string) => ({
            accessorKey: header,
            header: header,
          }))}
          data={data.rows.data}
        />
      </section>
      <footer>
        <Button
          variant={"outline"}
          onClick={handlePreviousPage}
          disabled={data.rows.previous === null}
        >
          Anterior
        </Button>
        <Button
          variant={"outline"}
          onClick={handleNextPage}
          disabled={data.rows.next === null}
        >
          Siguiente
        </Button>
      </footer>
    </ResultContainer>
  );
}

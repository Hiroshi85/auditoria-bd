"use client";
import Spinner from "@/components/ui/spinner";
import { usePersonalizadas } from "../personalizados.context";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/layout/table/table-details";
import { useConnectionDatabase } from "@/providers/connection";

interface ResultsProps {
  children: React.ReactNode;
  className?: string;
  type?: "error" | "ok";
}

export default function CustomExceptionResults() {
  const { query } = usePersonalizadas();
  const { data, isLoading, isError } = query;
  const connection = useConnectionDatabase();

  function ResultContainer({ children, className, type }: ResultsProps) {
    return (
      <div
        className={cn(
          "flex flex-col bg-accent w-full rounded-lg p-4 border",
          type === "ok"
            ? "border-green-500 bg-white"
            : type === "error"
            ? "border-red-500 bg-red-200"
            : "",
          className
        )}
      >
        {children}
      </div>
    );
  }

  if (isLoading)
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
    <ResultContainer type="error">
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-red-500">Error</h2>
        <p className="w-full bg-accent rounded-md px-2">{data.query}</p>
        <p>
          <strong className="uppercase">{connection.engine + " "}</strong>
          {data.instance_error}
        </p>
        <p className="txt-sm">
          # {data.error_code} - {data.sql_error}
        </p>
      </div>
    </ResultContainer>
  ) : (
    <ResultContainer type="ok">
      <DataTable
        columns={data.data.headers.map((header: string) => ({
          accessorKey: header,
          header: header,
        }))}
        data={data.data.rows}
      />
    </ResultContainer>
  );
}

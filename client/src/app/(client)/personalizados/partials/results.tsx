"use client";
import Spinner from "@/components/ui/spinner";
import { usePersonalizadas } from "../personalizados.context";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/layout/table/table-details";

interface ResultsProps {
  children: React.ReactNode;
  className?: string;
  type?: "error" | "ok";
}

export default function CustomExceptionResults() {
  const { query } = usePersonalizadas();
  const { data, isLoading, isError } = query;

  function ResultContainer({ children, className, type }: ResultsProps) {
    return (
      <div
        className={cn(
          "flex flex-col bg-accent w-full rounded-lg p-4 border",
          type === "ok"
            ? "border-green-500"
            : type === "error"
            ? "border-red-500"
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
    <ResultContainer type="error">{data.message}</ResultContainer>
  ) : (
    <ResultContainer type="ok">
      <DataTable
        columns={data.data.headers.map((header: string) => ({
          accessorKey: header,
          header: header
        }))}
        data={data.data.rows}
      />
    </ResultContainer>
  );
}

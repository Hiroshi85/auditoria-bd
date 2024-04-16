"use client";
import Spinner from "@/components/ui/spinner";
import { usePersonalizadas } from "../personalizados.context";
import { ResultContainer } from "@/components/ui/result-container";
import { useConnectionDatabase } from "@/providers/connection";
import { useQuery } from "@tanstack/react-query";
import { getResultado } from "@/services/resultados";
import { PersonalizadaResult } from "@/types/excepciones/personalizadas";
import ResultadoPersonalizada from "../../resultados/[id]/partials/personalizada";

export default function CustomExceptionResults() {
  const { executeException } = usePersonalizadas();
  const { data, isPending, isError } = executeException;

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

  if (data.result === "error") {
    return (
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
    );
  } else {
    const resultado = useQuery({
      queryKey: ["resultado", data?.exception_id],
      queryFn: () => getResultado(data?.exception_id.toString()),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

    if (resultado.isPending) {
      return (
        <ResultContainer>
          <Spinner />
        </ResultContainer>
      );
    }

    return (
      <ResultadoPersonalizada
        data={resultado.data?.data?.results as PersonalizadaResult}
      />
    );
  }
}

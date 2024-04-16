"use client";
import Spinner from "@/components/ui/spinner";
import { usePersonalizadas } from "../personalizados.context";
import { ResultContainer } from "@/components/ui/result-container";
import { useConnectionDatabase } from "@/providers/connection";
import { useQuery } from "@tanstack/react-query";
import { getResultado } from "@/services/resultados";
import { PersonalizadaResult } from "@/types/excepciones/personalizadas";
import { useEffect } from "react";
import ResultadoPersonalizado from "../../resultados/[id]/partials/personalizado";
import { ResultsPersonalizadas } from "@/types/resultados";

export default function CustomExceptionResults() {
  const { executeException, resultId, setResultId } = usePersonalizadas();
  const { data, isPending, isError } = executeException;
  const resultado = useQuery({
    queryKey: ["resultado", resultId],
    queryFn: () => (resultId ? getResultado(resultId) : null),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!resultId,
  });
  const connection = useConnectionDatabase();

  useEffect(() => {
    console.log("resultId", resultId);
  }, [resultId]);

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

  if (!data) {
    return (
      <ResultContainer>
        Aquí se mostrarán los resultados de la ejecución
      </ResultContainer>
    );
  }

  if (data.result === "error") {
    return (
      <ResultContainer type="error">
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
    if (resultId) {
      if (resultado.isLoading)
        return (
          <ResultContainer>
            <Spinner />
          </ResultContainer>
        );

      if (resultado.isError)
        return (
          <ResultContainer type="error">
            Error al cargar los resultados
          </ResultContainer>
        );

      if (resultado.data)
        return (
          <ResultadoPersonalizado
            data={resultado.data.data?.results as ResultsPersonalizadas}
          />
        );
    } else {
      return (
        <ResultContainer type="danger">
          La consulta realizada es demasiado grande para ser guardada almacenada
          en la base de datos
        </ResultContainer>
      );
    }
  }
}

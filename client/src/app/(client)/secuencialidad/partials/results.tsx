"use client";
import Spinner from "@/components/ui/spinner";
import { useSecuencia } from "../secuencia.context";

import { ResultContainer } from "@/components/ui/result-container";
import { useQuery } from "@tanstack/react-query";
import { getResultado } from "@/services/resultados";
import { ResultsSecuencial } from "@/types/resultados";
import ResultadoSecuencialidad from "../../resultados/[id]/partials/secuencialidad";
import { InfoIcon } from "lucide-react";

export default function SeqExceptionResults() {
  const { mutation, resultId } = useSecuencia();
  const { data, isError, isPending } = mutation;

  const resultado = useQuery({
    queryKey: ["resultado", resultId],
    queryFn: () => (resultId ? getResultado(resultId) : null),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!resultId,
  });

  if (isPending) {
    return (
      <ResultContainer>
        <Spinner className="mx-auto" />
      </ResultContainer>
    );
  }

  if (isError) {
    return (
      <ResultContainer type="error">
        <p className="text-red txt-md">Error al cargar los resultados</p>
      </ResultContainer>
    );
  }

  if (!data) {
    return (
      <ResultContainer>
        <p>Aquí se mostrarán los resultados de la ejecución</p>
      </ResultContainer>
    );
  }

  if (data.result === "error") {
    return (
      <ResultContainer type="error" className="text-red txt-md">
        <p className="text-destructive font-semibold">{data.message}</p>
        {data.min && data.max && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex gap-4">
              <InfoIcon className="mt-2" />
              <div>
                <h2 className="text-blue-500 leading-tight font-bold">
                  Registros encontrados
                </h2>
                <h3 className="text-sm leading-tight text-muted-foreground font-semibold">
                  Intente con alguno de ellos como ejemplo de secuencia
                </h3>
                <div className="[&>p]:text-sm">
                  <p>
                    <strong>Valor mínimo:</strong> {data.min}
                  </p>
                  <p>
                    <strong>Valor máximo:</strong> {data.max}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ResultContainer>
    );
  }

  if (data.result === "ok" || data.result === "exception") {
    if (resultado.isLoading) {
      return (
        <ResultContainer>
          <Spinner className="mx-auto" />
        </ResultContainer>
      );
    }
    if (resultado.data)
      return resultId ? (
        <div className="px-0 mx-0">
          <ResultadoSecuencialidad
            data={resultado.data.data?.results as ResultsSecuencial}
          />
        </div>
      ) : (
        <ResultContainer>
          <h1>No se pudo recuperar el resultado</h1>
          <p>{resultado.data.error}</p>
        </ResultContainer>
      );
  }
}

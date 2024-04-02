"use client";

import { createContext, useContext, useState } from "react";
import { useConnectionDatabase } from "@/providers/connection";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  VerificarIntegridadDeCamposResponse,
  VerificarIntegridadDeCamposRequest,
} from "@/types/excepciones/integridad/campo";
import { verificarIntegridadDeCamposRequest } from "@/server/excepciones/integridad/campo";

interface CamposProviderProps {
  query: UseQueryResult<VerificarIntegridadDeCamposResponse | null, Error>;
  auditException: (requestData: VerificarIntegridadDeCamposRequest) => void;
  clearResults: () => void;
}

const CamposContext = createContext<CamposProviderProps>(
  {} as CamposProviderProps
);

export function CamposProvider({ children }: { children: React.ReactNode }) {
  const connection = useConnectionDatabase();
  const [requestData, setRequestData] =
    useState<VerificarIntegridadDeCamposRequest | null>(null);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["results", requestData],
    queryFn: () =>
      verificarIntegridadDeCamposRequest({
        columnas: requestData?.columnas ?? [],
        table: requestData?.table ?? "",
        connectionId: connection.id,
      }),
    enabled: !!requestData,
  });

  function auditException(requestData: VerificarIntegridadDeCamposRequest) {
    setRequestData(requestData);
  }

  function clearResults() {
    setRequestData(null);
    queryClient.removeQueries({ queryKey: ["results", requestData] });
  }

  return (
    <CamposContext.Provider
      value={{
        query,
        auditException,
        clearResults,
      }}
    >
      {children}
    </CamposContext.Provider>
  );
}

export function useCamposContext() {
  const context = useContext(CamposContext);
  if (!context) {
    throw new Error("useCampos must be used within a CamposProvider");
  }
  return context;
}

'use client';

import { createContext, useContext, useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  VerificarIntegridadDeCamposResponse,
  VerificarIntegridadDeCamposRequest,
} from "@/types/excepciones/integridad/campo";
import axios from "axios";
import { API_HOST } from "@/constants/server";
import { ensureError } from "@/lib/errors";

interface CamposProviderProps {
  mutation: ReturnType<typeof useMutation< VerificarIntegridadDeCamposResponse, Error, VerificarIntegridadDeCamposRequest, unknown >>;
  auditException: (formData: VerificarIntegridadDeCamposRequest) => void;
  clearResults: () => void;
}

const CamposContext = createContext<CamposProviderProps>(
  {} as CamposProviderProps
);

async function verificarIntegridadDeCamposRequest(data: VerificarIntegridadDeCamposRequest): Promise<VerificarIntegridadDeCamposResponse> {

  try {
    console.log(data)
    const response = await axios.post(`${API_HOST}/exceptions/db/${data.connectionId}/fields`,
      data,
      { withCredentials: true } // This is important to send the cookies
    )

    if (response.status > 200) {
      return {
        error: response.statusText,
        data: null
      }
    }

    return {
      error: null,
      data: response.data
    }

  } catch (e) {
    const error = ensureError(e)
    return {
      error: "Error verificando integridad de campos. " + error.message,
      data: null
    }
  }
}

export function CamposProvider({ children }: { children: React.ReactNode }) {
  const [requestData, setRequestData] =
    useState<VerificarIntegridadDeCamposRequest | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation(

    {
      mutationFn: (data: VerificarIntegridadDeCamposRequest) => verificarIntegridadDeCamposRequest(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['resultados'] })
      },
    }
  );

  function auditException(requestData: VerificarIntegridadDeCamposRequest) {
    setRequestData(requestData);
    mutation.mutate(requestData);
  }

  function clearResults() {
    setRequestData(null);
    queryClient.removeQueries({ queryKey: ["results-fields", requestData] });
  }

  return (
    <CamposContext.Provider
      value={{
        mutation,
        clearResults,
        auditException
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

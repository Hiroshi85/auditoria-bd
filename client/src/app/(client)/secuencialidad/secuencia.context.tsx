"use client";

import { API_HOST } from "@/constants/server";
import { getExceptionType } from "@/helpers/exc-secuenciales/tipos";
import { useConnectionDatabase } from "@/providers/connection";
import {
  SecuenciaResponse,
  VerificarSecuenciaRequest,
} from "@/types/excepciones/secuencias";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UseQueryResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SecuencialFormSchema } from "./partials/form/schema";
import { z } from "zod";

// Función para enviar la petición POST
async function postSecuenciaRequest(
  formData: VerificarSecuenciaRequest,
  columnType: string,
  connectionId: number
) {
  const exc_type = getExceptionType(columnType);

  if (exc_type === "") {
    toast.error("Seleccione una columna válida");
    throw new Error("Invalid column type");
  }

  const response = await axios.post(
    `${API_HOST}/exceptions/db/${connectionId}/sequence/${exc_type}`,
    formData,
    { withCredentials: true }
  );

  return response.data as SecuenciaResponse;
}

interface SecuenciaProviderProps {
  auditException: (formData: VerificarSecuenciaRequest, type: string) => void;
  setColumnType: (type: string) => void;
  clearResults: () => void;
  selectedType: string | null;
  mutation: ReturnType<
    typeof useMutation<
      SecuenciaResponse,
      Error,
      VerificarSecuenciaRequest,
      unknown
    >
  >;
  form: ReturnType<typeof useForm<z.infer<typeof SecuencialFormSchema>>>;
  resultId: string | null;
  setResultId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SecuenciaContext = createContext<SecuenciaProviderProps>(
  {} as SecuenciaProviderProps
);

export function SecuencialProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resultId, setResultId] = useState<string | null>(null);
  const [columnType, setColumnType] = useState("");
  const connection = useConnectionDatabase();
  const [formData, setFormData] = useState<VerificarSecuenciaRequest | null>(
    null
  );
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof SecuencialFormSchema>>({
    defaultValues: {
      column: undefined,
      column_type: "",
      example: "",
      min: "",
      max: "",
      step: 1,
      static: true,
      frequency: "D",
      min_date: undefined,
      max_date: undefined,
    },
    resolver: zodResolver(SecuencialFormSchema),
  });

  const mutation = useMutation({
    mutationFn: (formData: VerificarSecuenciaRequest) => {
      return postSecuenciaRequest(formData, columnType, connection.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resultados"],
      });
    },
  });

  useEffect(() => {
    if (mutation.data && (mutation.data.result === "exception" || mutation.data.result === "ok")) {
      setResultId(mutation.data.exception_id.toString());
    }
  }, [mutation.data]);

  function clearResults() {
    setFormData(null);
    queryClient.removeQueries({ queryKey: ["results-sequence", formData] });
  }

  function auditException(formData: VerificarSecuenciaRequest, type: string) {
    setFormData(formData);
    setColumnType(type);
    mutation.mutate(formData);
  }

  return (
    <SecuenciaContext.Provider
      value={{
        selectedType: columnType,
        setColumnType,
        auditException,
        clearResults,
        mutation,
        form,
        resultId,
        setResultId,
      }}
    >
      {children}
    </SecuenciaContext.Provider>
  );
}

export function useSecuencia() {
  const context = useContext(SecuenciaContext);

  if (!context) {
    throw new Error(
      "useSecuencia must be used within a ConnectionDatabaseProvider"
    );
  }

  return context;
}

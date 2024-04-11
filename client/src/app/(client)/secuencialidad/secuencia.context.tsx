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
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SecuencialFormSchema } from "./partials/form/schema";
import { z } from "zod";

interface SecuenciaProviderProps {
  auditException: (formData: VerificarSecuenciaRequest, type: string) => void;
  setColumnType: (type: string) => void;
  clearResults: () => void;
  selectedType: string | null;
  query: UseQueryResult<SecuenciaResponse, Error>;
  form: ReturnType<typeof useForm<z.infer<typeof SecuencialFormSchema>>>;
}

const SecuenciaContext = createContext<SecuenciaProviderProps>(
  {} as SecuenciaProviderProps
);

export function SecuencialProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
  
  const query = useQuery({
    queryKey: ["results-sequence", formData],
    queryFn: async () => {
      const exc_type = getExceptionType(columnType);
      console.log("Enviando data:  ", formData);

      if (exc_type === "") {
        toast.error("Seleccione una columna válida");
      }

      const response = await axios.post(
        `${API_HOST}/exceptions/db/${connection.id}/sequence/${exc_type}`,
        formData,
        { withCredentials: true }
      );

      return response.data as SecuenciaResponse;
    },
    enabled: !!formData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  function clearResults() {
    setFormData(null);
    queryClient.removeQueries({queryKey: ["results-sequence", formData]});
  }

  function auditException(formData: VerificarSecuenciaRequest, type: string) {
    setFormData(formData);
    setColumnType(type);
  }

  return (
    <SecuenciaContext.Provider
      value={{
        selectedType: columnType,
        setColumnType,
        auditException,
        clearResults,
        query,
        form
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

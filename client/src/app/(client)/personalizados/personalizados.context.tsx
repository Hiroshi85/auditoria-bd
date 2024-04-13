'use client';

import {
  createContext,
  useContext,
  useState,
} from "react";
import { useConnectionDatabase } from "@/providers/connection";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  PersonalizadaResponse,
  VerificarPersonalizadaRequest,
  CustomQueriesResponse,
} from "@/types/excepciones/personalizadas";
import axios from "axios";
import { API_HOST } from "@/constants/server";
import { useForm } from "react-hook-form";
import { PersonalizadasFormSchema } from "./partials/form/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

interface PersonalizadasProviderProps {
  query: UseMutationResult<PersonalizadaResponse, Error, VerificarPersonalizadaRequest, unknown>;
  auditException: (data: VerificarPersonalizadaRequest) => void;
  clearResults: () => void;
  saveQuery: UseMutationResult<CustomQueriesResponse, Error, void, unknown>;
  deleteQuery: UseMutationResult<void, Error, number, unknown>;
  form: ReturnType<typeof useForm<z.infer<typeof PersonalizadasFormSchema>>>;
  selectedQuery: CustomQueriesResponse | null;
  setSelectedQuery: React.Dispatch<React.SetStateAction<CustomQueriesResponse | null>>;
  connection: ReturnType<typeof useConnectionDatabase>;
}

const PersonalizadasContext = createContext<PersonalizadasProviderProps>(
  {} as PersonalizadasProviderProps
);

export function PersonalizadasProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const connection = useConnectionDatabase();
  const [formData, setFormData] =
    useState<VerificarPersonalizadaRequest | null>(null);
  const queryClient = useQueryClient();
  const [selectedQuery, setSelectedQuery] = useState<CustomQueriesResponse | null>(null);

  const form = useForm<z.infer<typeof PersonalizadasFormSchema>>({
    defaultValues: {
      table: "",
      name: "",
      query: "",
    },
    resolver: zodResolver(PersonalizadasFormSchema),
  });

  const query = useMutation<PersonalizadaResponse, Error, VerificarPersonalizadaRequest>({
    mutationFn: async () => {
      const response = await axios.post(
        `${API_HOST}/exceptions/db/${connection.id}/custom`,
        formData,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["results-custom", "resultados"],
      });
    },
  });

  const saveQuery = useMutation<CustomQueriesResponse, Error, void>({
    mutationFn: async () => {
      const response = await axios.post(
        `${API_HOST}/exceptions/db/${connection.id}/custom/queries/save`,
        {
          table: formData!.table,
          name: formData!.name,
          query: formData!.query,
          only_this_connection: true,
        },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Consulta ${selectedQuery === null ? "guardada" : "actualizada"}!`);
      queryClient.invalidateQueries({
        queryKey: ["custom-queries", "resultados"],
      });
    },
  });

  const deleteQuery = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await axios.delete(
        `${API_HOST}/exceptions/custom/queries/${id}/delete`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success("Consulta eliminada!");
      queryClient.invalidateQueries({
        queryKey: ["custom-queries", "resultados"],
      });
    },
  });

  function auditException(formData: VerificarPersonalizadaRequest) {
    setFormData(formData);
    query.mutate(formData);
  }

  function clearResults() {
    setFormData(null);
    queryClient.invalidateQueries({
      queryKey: ["results-custom", "resultados"],
    });

  }

  return (
    <PersonalizadasContext.Provider
      value={{
        query,
        saveQuery,
        deleteQuery,
        form,
        connection,
        selectedQuery,
        setSelectedQuery,
        auditException,
        clearResults,
      }}
    >
      {children}
    </PersonalizadasContext.Provider>
  );
}

export function usePersonalizadas() {
  const context = useContext(PersonalizadasContext);
  if (!context) {
    throw new Error(
      "usePersonalizadas must be used within a PersonalizadasProvider"
    );
  }
  return context;
}

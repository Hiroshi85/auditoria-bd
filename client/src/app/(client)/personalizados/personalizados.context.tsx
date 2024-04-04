"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";
import { useConnectionDatabase } from "@/providers/connection";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
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
  query: UseQueryResult<PersonalizadaResponse, Error>;
  auditException: (formData: VerificarPersonalizadaRequest) => void;
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
  // const selectedQuery = useRef<CustomQueriesResponse | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<CustomQueriesResponse | null>(null);

  const form = useForm<z.infer<typeof PersonalizadasFormSchema>>({
    defaultValues: {
      table: "",
      task_name: "",
      query: "",
    },
    resolver: zodResolver(PersonalizadasFormSchema),
  });

  const query = useQuery({
    queryKey: ["results-custom", formData],
    queryFn: async () => {
      const response = await axios.post(
        `${API_HOST}/exceptions/db/${connection.id}/custom`,
        formData,
        { withCredentials: true }
      );

      return response.data as PersonalizadaResponse;
    },
    enabled: !!formData,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const saveQuery = useMutation({
    mutationFn: selectedQuery ? updateQueryFn : saveQueryFn,
    onSuccess: () => {
      toast.success(`Consulta ${selectedQuery === null ? "guardada" : "actualizada"}!`);
      queryClient.invalidateQueries({ queryKey: ["custom-queries"] });
    },
  });

  const deleteQuery = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(
        `${API_HOST}/exceptions/custom/queries/${id}/delete`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success("Consulta eliminada!");
      queryClient.invalidateQueries({ queryKey: ["custom-queries"] });
    },
  
  })

  async function saveQueryFn() {
    const response = await axios.post(
      `${API_HOST}/exceptions/db/${connection.id}/custom/queries/save`,
      {
        table: form.getValues("table"),
        name: form.getValues("task_name"),
        query: form.getValues("query"),
        only_this_connection: true,
      },
      { withCredentials: true }
    );
    return response.data as CustomQueriesResponse;
  }

  async function updateQueryFn() {
    console.log("selectedQuery", selectedQuery);
    const response = await axios.put(
      `${API_HOST}/exceptions/db/${connection.id}/custom/queries/save`,
      {
        id: selectedQuery?.id,
        table: form.getValues("table"),
        name: form.getValues("task_name"),
        query: form.getValues("query"),
        only_this_connection: true,
      },
      { withCredentials: true }
    );
    return response.data as CustomQueriesResponse;
  }

  function auditException(formData: VerificarPersonalizadaRequest) {
    console.log("Enviando datos:  ", formData);
    setFormData(formData);
  }

  function clearResults() {
    setFormData(null);
    queryClient.removeQueries({ queryKey: ["results-custom", formData] });
  }

  return (
    <PersonalizadasContext.Provider
      value={{
        query,
        saveQuery,
        deleteQuery,
        form,
        connection,
        selectedQuery: selectedQuery,
        setSelectedQuery: setSelectedQuery,
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

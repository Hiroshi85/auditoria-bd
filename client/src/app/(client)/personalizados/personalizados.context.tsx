"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useConnectionDatabase } from "@/providers/connection";
import {
  useMutation,
  useQueryClient,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import {
  PersonalizadaResponse,
  VerificarPersonalizadaRequest,
  CustomQueriesResponse,
  PersonalizadaResult,
} from "@/types/excepciones/personalizadas";
import axios from "axios";
import { API_HOST } from "@/constants/server";
import { useForm } from "react-hook-form";
import { PersonalizadasFormSchema } from "./partials/form/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

interface PersonalizadasProviderProps {
  executeException: UseMutationResult<
    PersonalizadaResponse,
    Error,
    VerificarPersonalizadaRequest,
    unknown
  >;
  auditException: (data: VerificarPersonalizadaRequest) => void;
  // Results methods
  clearResults: () => void;
  saveQuery: UseMutationResult<
    CustomQueriesResponse,
    Error,
    VerificarPersonalizadaRequest,
    unknown
  >;
  resultId: string | null;
  setResultId: React.Dispatch<React.SetStateAction<string | null>>;  
  //
  deleteQuery: UseMutationResult<void, Error, number, unknown>;
  form: ReturnType<typeof useForm<z.infer<typeof PersonalizadasFormSchema>>>;
  selectedQuery: CustomQueriesResponse | null;
  setSelectedQuery: React.Dispatch<React.SetStateAction<CustomQueriesResponse | null>>;
  connection: ReturnType<typeof useConnectionDatabase>;
  // ***** Navigation functions
  handleNextPage: () => void;
  handlePreviousPage: () => void;
  // handleGoToPage: (page: number) => void;
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
  const queryClient = useQueryClient();
  const [selectedQuery, setSelectedQuery] =
    useState<CustomQueriesResponse | null>(null);

  const [resultId, setResultId] = useState<string | null>(null);


  const form = useForm<z.infer<typeof PersonalizadasFormSchema>>({
    defaultValues: {
      table: "",
      name: "",
      query: "",
    },
    resolver: zodResolver(PersonalizadasFormSchema),
  });

  // region SAVE RESULT
  const executeException = useMutation<
    PersonalizadaResponse,
    Error,
    VerificarPersonalizadaRequest
  >({ 
    mutationFn: async ({ table, name, query }) => {
      const response = await axios.post(
        `${API_HOST}/exceptions/db/${connection.id}/custom`,
        { table, name, query },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["results-custom", "save-result"],
      });
    },
  });

  useEffect(() => {
    if (executeException.data) {
      if(executeException.data.result === 'ok'){
        if (executeException.data.exception_id)
         setResultId(executeException.data.exception_id.toString());
      }
    console.log("executeException", executeException.data);
    }
  }, [executeException.data])


  function auditException(formData: VerificarPersonalizadaRequest) {
    executeException.mutate(formData);
  }

  function clearResults() {
    executeException.reset();
    setResultId(null);
  }

  // region Queries CRUD
  const saveQuery = useMutation<
    CustomQueriesResponse,
    Error,
    VerificarPersonalizadaRequest
  >({
    mutationFn: selectedQuery ? updateQueryFn : saveQueryFn,
    onSuccess: () => {
      toast.success(
        `Consulta ${selectedQuery === null ? "guardada" : "actualizada"}!`
      );
      queryClient.invalidateQueries({ queryKey: ["custom-queries"] });
    },
  });
  async function saveQueryFn() {
    const response = await axios.post(
      `${API_HOST}/exceptions/db/${connection.id}/custom/queries/save`,
      {
        table: form.getValues("table"),
        name: form.getValues("name"),
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
        name: form.getValues("name"),
        query: form.getValues("query"),
        only_this_connection: true,
      },
      { withCredentials: true }
    );
    return response.data as CustomQueriesResponse;
  }
  const deleteQuery = useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_HOST}/exceptions/custom/queries/${id}/delete`, {
        withCredentials: true,
      });
    },
    onSuccess: () => {
      toast.success("Consulta eliminada!");
      queryClient.invalidateQueries({
        queryKey: ["custom-queries"],
      });
    },
  });

  // region Navigation
  function handleNextPage() {
    // request with page params
    // if (query.data?.data) {
    //   if (!query.data.rows.next) return;
    //   // mutate same query with next page :
    //   /*
    //     next: http://localhost:8000/exceptions/db/3/custom?p=3
    //   */
    //   const nextPageUrl = query.data.rows.next;
    //   query.mutate({
    //     ...(form.getValues() as VerificarPersonalizadaRequest),
    //     url: nextPageUrl,
    //   });
    //   console.log("next page", query.data.rows.next);
    // }
  }

  function handlePreviousPage() {
    // request with page params
    // if (query.data && query.data.result === "ok") {
    //   if (query.data.rows.previous === null) return;
    //   const previousPageUrl = query.data.rows.previous;
    //   query.mutate({
    //     ...(form.getValues() as VerificarPersonalizadaRequest),
    //     url: previousPageUrl,
    //   });
    // }
  }

  // function handleGoToPage(page: number) {
  //   // request with page params
  //   if (query.data && query.data.result === "ok")
  //     console.log("go to page", page);
  // }
  //endregion
  return (
    <PersonalizadasContext.Provider
      value={{
        executeException,
        saveQuery,
        deleteQuery,
        form,
        connection,
        selectedQuery,
        resultId,
        setResultId,
        setSelectedQuery,
        auditException,
        clearResults,
        handleNextPage,
        handlePreviousPage,
        // handleGoToPage,
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

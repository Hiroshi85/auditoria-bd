"use client";

import { createContext, useContext, useState } from "react";
import { useConnectionDatabase } from "@/providers/connection";
import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { PersonalizadaResponse, VerificarPersonalizadaRequest } from "@/types/excepciones/personalizadas";
import axios from "axios";
import { API_HOST } from "@/constants/server";

interface PersonalizadasProviderProps {
    query: UseQueryResult<PersonalizadaResponse, Error>;
    auditException: (formData: VerificarPersonalizadaRequest) => void;
    clearResults: () => void;
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
  const [formData, setFormData] = useState<VerificarPersonalizadaRequest | null>(null)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["results", formData],
    queryFn: async () => {
        const response = await axios.post(
            `${API_HOST}/exceptions/db/${connection.id}/custom`,
            formData,
            { withCredentials: true }
        );
    
        return response.data as PersonalizadaResponse;
    },
    enabled: !!formData,
  })

  function auditException(formData: VerificarPersonalizadaRequest){
    console.log("Enviando datos:  ", formData);
    setFormData(formData);
  }

  function clearResults(){
    setFormData(null);
    queryClient.removeQueries({ queryKey :["results", formData]});
  }


  return (
    <PersonalizadasContext.Provider value={{
        query,
        auditException,
        clearResults
    }}>
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

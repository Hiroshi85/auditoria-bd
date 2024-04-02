"use client"
import { API_HOST } from "@/constants/server";
import { useConnectionDatabase } from "@/providers/connection";
import { TableExceptionRequest, TableExceptionResponse } from "@/types/excepciones/tablas";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";

interface TableExceptionProviderProps {
    auditException: (formData: any) => void;
    clearResults: () => void;
    query: UseQueryResult<TableExceptionResponse, Error>;
}

const TablaeExcepctionContext = createContext<TableExceptionProviderProps>(
    {} as TableExceptionProviderProps
);

export default function TableExceptionProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [formData, setFormData] = useState<TableExceptionResponse | null>(
        null
    );
    const connection = useConnectionDatabase();

    function auditException(formData: any) {
        setFormData(formData);
        if (formData == null) {
        }else {
            query.refetch();
        }
    }

    function clearResults() {
        setFormData(null);
    }

    const query = useQuery({
        queryKey: ["results", formData],
        queryFn: async () => {
            const response = await axios.post(
                `${API_HOST}/exceptions/db/${connection.id}/tables`,
                formData,
                { withCredentials: true }
            );

            return response.data;
        },
        enabled: !!formData,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return (
        <TablaeExcepctionContext.Provider value={{
            auditException,
            clearResults,
            query
        }}>
            {children}
        </TablaeExcepctionContext.Provider>
    )
}

export function useTableException() {
    const context = useContext(TablaeExcepctionContext);

    if (!context) {
        throw new Error(
            "useTableException debe ser usado dentro de un TableExceptionProvider"
        );
    }

    return context;
}
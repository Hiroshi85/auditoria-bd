'use client';
import { API_HOST } from "@/constants/server";
import { useConnectionDatabase } from "@/providers/connection";
import { TableExceptionRequest, TableExceptionResponse } from "@/types/excepciones/tablas";
import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";

// Función para enviar la petición POST
async function postTableExceptionRequest(formData: TableExceptionRequest, connectionId: number): Promise<TableExceptionResponse> {
    const response = await axios.post(
        `${API_HOST}/exceptions/db/${connectionId}/tables`,
        formData,
        { withCredentials: true }
    );

    return response.data;
}

interface TableExceptionProviderProps {
    auditException: (formData: TableExceptionRequest) => void;
    mutation: UseMutationResult<TableExceptionResponse, unknown, TableExceptionRequest, unknown>;
    clearResults: () => void;
}

const TableExceptionContext = createContext<TableExceptionProviderProps>(
    {} as TableExceptionProviderProps
);

export default function TableExceptionProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [formData, setFormData] = useState<TableExceptionRequest | null>(
        null
    );
    const queryClient = useQueryClient();

    const connection = useConnectionDatabase();

    const mutation = useMutation({
        mutationFn: (formData: TableExceptionRequest) => postTableExceptionRequest(formData, connection.id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['resultados']
            });
        }
    });

    function auditException(formData: TableExceptionRequest) {
        setFormData(formData);
        if (formData == null) {
            // Aquí puedes realizar alguna acción adicional si es necesario
        } else {
            mutation.mutate(formData);
        }
    }

    function clearResults() {
        setFormData(null);
    }

    return (
        <TableExceptionContext.Provider value={{
            mutation,
            auditException,
            clearResults,
        }}>
            {children}
        </TableExceptionContext.Provider>
    )
}

export function useTableException() {
    const context = useContext(TableExceptionContext);

    if (!context) {
        throw new Error(
            "useTableException debe ser usado dentro de un TableExceptionProvider"
        );
    }

    return context;
}

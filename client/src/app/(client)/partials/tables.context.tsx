"use client"

import { API_HOST } from "@/constants/server"
import { useConnectionDatabase } from "@/providers/connection"
import { Column, TableDetailsResponse } from "@/types/database"
import { UseQueryResult, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { createContext, useContext, useState } from "react"

interface TableData{
    name: string,
    columns: Column[]
}

interface TablesProviderProps {
    tables: string[]
    setTable: (table: string) => void
    currentTable: string | null
    query: UseQueryResult<TableDetailsResponse, Error>
}

const TablesContext = createContext<TablesProviderProps>({
} as TablesProviderProps)

export function TablesProvider({
    children,
    data
}: {
    children: React.ReactNode
    data: string[]
}) {
    const [table, setTable] = useState(null as null | string)
    const connection = useConnectionDatabase()

    const query = useTable(table, connection.id)

    async function setCurrentTable(data: string) {
        if (data == table) {
            setTable(null)
            return
        }
        
        setTable(data)
    }

    return (
        <TablesContext.Provider value={{
            currentTable: table,
            setTable: setCurrentTable,
            tables: data,
            query
        }}>
            {children}
        </TablesContext.Provider>
    )

}

function useTable(table: string | null, connectionId: number) {
    return useQuery({
        queryKey: ["table", table],
        queryFn: async () => {
            const response = await axios.get(`${API_HOST}/aud/connection/${connectionId}/tables/${table}`, {withCredentials: true})
            return response.data as TableDetailsResponse
        },
        enabled: table != null
    })
}

export function useTablesDB() {
    const context = useContext(TablesContext)
    if (!context) {
        throw new Error("useConnectionDatabase must be used within a ConnectionDatabaseProvider")
    }
    return context
}
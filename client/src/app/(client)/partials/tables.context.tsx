"use client"

import { createContext, useContext, useState } from "react"

interface TableData{
    name: string,
    columns: string[]
}

interface TablesProviderProps {
    tables: string[]
    setTable: (table: string) => void
    currentTable: TableData | null
}

const TablesContext = createContext<TablesProviderProps>({
    tables: [],
    setTable: (data) => {},
    currentTable: null as null | TableData
})

export function TablesProvider({
    children,
    data
}: {
    children: React.ReactNode
    data: string[]
}) {
    const [table, setTable] = useState(null as null | TableData)

    async function setCurrentTable(data: string) {
        setTable({
            name: data,
            columns: []
        })
    }

    return (
        <TablesContext.Provider value={{
            currentTable: table,
            setTable: setCurrentTable,
            tables: data
        }}>
            {children}
        </TablesContext.Provider>
    )

}

export function useTablesDB() {
    const context = useContext(TablesContext)
    if (!context) {
        throw new Error("useConnectionDatabase must be used within a ConnectionDatabaseProvider")
    }
    return context
}
"use client"
import { DatabaseConnectionsType } from "@/types/database";
import { createContext, useContext, useState } from "react";

interface ConnectionProviderProps {
    engine: DatabaseConnectionsType
    name: string
    host: string
    port: number
    username: string
    password: string
    status: "connected" | "disconnected" | "connecting"
    testConnections: (data: ConnectionProps) => Promise<boolean>
}

interface ConnectionProps {
    engine: DatabaseConnectionsType
    name: string
    host: string
    port: number
    username: string
    password: string
}

export const ConnectionDatabaseContext = createContext<ConnectionProviderProps>({
    engine: "sqlserver",
    name: "",
    host: "",
    port: 0,
    username: "",
    password: "",
    status: "disconnected",
    testConnections: async () => false
})


export function ConnectionDatabaseProvider({ children }: { children: React.ReactNode }) {
    const [connection, setConnection] = useState<ConnectionProps>({
        engine: "sqlserver",
        name: "",
        host: "localhost",
        port: 1433,
        username: "sa",
        password: "",
    })

    const [status, setStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")

    async function testConnections(data : ConnectionProps): Promise<boolean> {
        // TODO: implement the connection test

        setStatus("connecting")
        
        return new Promise((resolve) => {
            setTimeout(() => {
                setStatus("connected")
                setConnection(data)
                resolve(true)
            }, 2000)
        })
    }
    
    return (
        <ConnectionDatabaseContext.Provider value={{
            ...connection,
            status,
            testConnections
        }}>
            {children}
        </ConnectionDatabaseContext.Provider>
    )
}

export function useConnectionDatabase() {
    const context = useContext(ConnectionDatabaseContext)
    if (!context) {
        throw new Error("useConnectionDatabase must be used within a ConnectionDatabaseProvider")
    }
    return context
}
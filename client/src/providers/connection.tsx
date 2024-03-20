"use client"
import { DatabaseConnectionsType } from "@/types/database";
import { createContext, useContext, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_HOST } from "@/constants/server";

interface ConnectionProviderProps {
    engine: DatabaseConnectionsType
    name: string
    host: string
    port: number
    username: string
    password: string
    status: "connected" | "disconnected" | "connecting"
    testConnections: (data: ConnectionProps) => Promise<{status: boolean, message:string}>
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
    testConnections: async () => {return {status: false, message: ""}}
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

    async function testConnections(data : ConnectionProps): Promise<{status: boolean, message:string}> {
        try {
            const response = await axios.post(`${API_HOST}/aud/test`, data,{
                withCredentials: true
            })
            return {
                status: true,
                message: response.data.message as string
            }
        }catch (e: any) {

            if (axios.isAxiosError(e)) {
                return {
                    status: false,
                    message: e.response?.data.detail || "Ha ocurrido un error"
                }
            }
            
            return {
                status: false,
                message: "Ha ocurrido un error"
            }
        }
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
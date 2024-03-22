"use client"
import { DatabaseConnectionsType } from "@/types/database";
import { createContext, useContext, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_HOST } from "@/constants/server";

interface ConnectionProviderProps {
    id: number,
    engine: DatabaseConnectionsType
    name: string
    host: string
    port: number
    username: string
    status: "connected" | "disconnected" | "connecting"
    testConnections: (data: ConnectionProps) => Promise<{status: boolean, message:string}>
    saveConnection: (data: ConnectionProps) => Promise<{status: boolean, message:string}>
    setConnection: (data: ConnectionProvider) => void
}

interface ConnectionProps {
    engine: DatabaseConnectionsType
    name: string
    host: string
    port: number
    username: string
    password: string
}

export interface ConnectionProvider {
    id: number
    engine: DatabaseConnectionsType
    name: string
    host: string
    port: number
    username: string
}

export const ConnectionDatabaseContext = createContext<ConnectionProviderProps>({
    id: 0,
    engine: "sqlserver",
    name: "",
    host: "",
    port: 0,
    username: "",
    status: "disconnected",
    testConnections: async () => {return {status: false, message: ""}},
    saveConnection: async () => {return {status: false, message: ""}},
    setConnection: () => {}
})


export function ConnectionDatabaseProvider({ 
    children,
    data
}: { 
    children: React.ReactNode
    data: ConnectionProvider
}) {
    const [connection, setConnection] = useState<ConnectionProvider>(data)

    const [status, setStatus] = useState<"connected" | "disconnected" | "connecting">(data.id != 0 ? "connected" : "disconnected")

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

    async function saveConnection(data: ConnectionProps) : Promise<{status: boolean, message:string}> {
        try {
            setStatus("connecting")
            
            const response = await axios.post(`${API_HOST}/aud/save`, data,{
                withCredentials: true
            })

            setConnection({
                engine: data.engine,
                name: data.name,
                host: data.host,
                port: data.port,
                username: data.username,
                id: response.data.id
            })

            setStatus("connected")

            return {
                status: true,
                message: response.data.message as string
            }
        }catch (e: any) {

            if (connection.id == 0 || (data.engine != connection.engine && 
                data.name != connection.name &&
                data.host != connection.host && 
                data.port != connection.port && 
                data.username != connection.username
            )) {
                // Disconnect if there were not a connection before or 
                setStatus("disconnected")
            }else {
                setStatus("connected")
            }

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
            testConnections,
            saveConnection,
            setConnection
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
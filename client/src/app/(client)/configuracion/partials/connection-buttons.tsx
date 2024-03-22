"use client"

import { useRouter } from "next/navigation";
import { Connection } from "./connections";
import { Button } from "@/components/ui/button";
import { CloudOffIcon, TrashIcon } from "lucide-react";
import { API_HOST } from "@/constants/server";
import axios from "axios";
import { toast } from "sonner";
import { useConnectionDatabase } from "@/providers/connection";
import { DatabaseConnectionsType } from "@/types/database";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ConnectToDatabaseOption({ connection }: { connection: Connection }) {
    const router = useRouter()
    const dataConnection = useConnectionDatabase()

    async function OnClick() {
        try {
            const response = await axios.post(`${API_HOST}/aud/connection/${connection.id}`, {}, { withCredentials: true })

            if (response.status == 200 && response.data.id != 0) {
                router.refresh()
                toast.success("Conectado")
                dataConnection.setConnection({
                    engine: connection.engine as DatabaseConnectionsType,
                    name: connection.name,
                    host: connection.host,
                    port: connection.port,
                    username: connection.username,
                    id: response.data.id
                })
            }

        } catch (error) {
            toast.error("Error al conectar")
        }
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} onClick={() => OnClick()}>
                        <span className="sr-only">Conectar</span>
                        <CloudOffIcon className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Conectar</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )


}

export function DeleteDatabaseOption({ connection }: { connection: Connection }) {
    const router = useRouter()

    async function OnClick() {
        try {
            const response = await axios.delete(`${API_HOST}/aud/connection/${connection.id}`, { withCredentials: true })

            if (response.status == 200) {
                router.refresh()
                toast.success("Conexión eliminada")
            }

        } catch (error) {
            toast.error("Error al eliminar")
        }
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} onClick={() => OnClick()}>
                        <span className="sr-only">Eliminar</span>
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Eliminar</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
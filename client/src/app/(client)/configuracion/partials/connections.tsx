import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_HOST } from "@/constants/server";
import { getLastConnection } from "@/server/get-connection";
import { fetcheServer } from "@/server/server-fetch";
import { BoltIcon, CircleGaugeIcon, CloudOff, CloudOffIcon, DatabaseIcon, ServerIcon, SignalIcon, TrashIcon, UserIcon } from "lucide-react";
import ConnectToDatabaseOption, { DeleteDatabaseOption } from "./connection-buttons";

export interface Root {
    connections: Connection[]
}

export interface Connection {
    id: number
    engine: string
    name: string
    host: string
    port: number
    username: string
    last_used: string
    current_used: boolean
}

export default async function ConnectionsView() {
    const lastConnection = await getLastConnection()
    const response = await fetcheServer(`${API_HOST}/aud/get/all`)

    const data = response.data as Root

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Engine</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Database</TableHead>
                        <TableHead>Port</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.connections.map((conn) => (
                        <TableRow key={conn.id}>
                            <TableCell className="font-medium">{conn.engine}</TableCell>
                            <TableCell>{conn.host}</TableCell>
                            <TableCell>{conn.name}</TableCell>
                            <TableCell>{conn.port}</TableCell>
                            <TableCell>{conn.username}</TableCell>
                            <TableCell>
                                {
                                    lastConnection.id == conn.id ? (
                                        <Button variant={"ghost"} size={"icon"}>
                                            <span className="sr-only">Desconectar</span>
                                            <SignalIcon className="w-4 h-4" />
                                        </Button>
                                    ) : (
                                        <>
                                            <ConnectToDatabaseOption connection={conn} />
                                            <DeleteDatabaseOption connection={conn} />
                                        </>
                                    )
                                }

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )

}
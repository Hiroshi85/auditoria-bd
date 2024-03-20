import { ConnectionProvider } from "@/providers/connection";
import { BoltIcon, CircleGauge, CircleGaugeIcon, DatabaseIcon, ServerIcon, UserIcon } from "lucide-react";

export default function CurrentConnection({
    connection
}: {
    connection: ConnectionProvider
}) {
    return (
        <div className="text-xs rounded-md bg-primary text-primary-foreground w-full py-2 px-5">
            {
                connection.id == 0 ? (
                    <div className="flex items-center space-x-1">
                        <span className="block w-2 h-2 rounded-full bg-red-400">
                        </span>
                        <p>Desconectado</p>
                    </div>
                ) : (

                    <div className="flex items-center pointer-events-none">
                        <span className="mr-5 block w-2 h-2 rounded-full bg-green-400">
                        </span>
                        <div className="flex-1 flex items-center gap-3 justify-center">
                            <div className="flex items-center gap-1">
                                <BoltIcon className="w-3 h-3 " />
                                <p>{connection.engine}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <ServerIcon className="w-3 h-3 " />
                                <p>{connection.host}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <DatabaseIcon className="w-3 h-3 " />
                                <p>{connection.name}</p>
                            </div>

                            <div className="flex items-center gap-1">
                                <CircleGaugeIcon className="w-3 h-3 " />
                                <p>{connection.port}</p>
                            </div>

                            <div className="flex items-center gap-1">
                                <UserIcon className="w-3 h-3 " />
                                <p>{connection.username}</p>
                            </div>
                        </div>
                        <span className="mr-5 block w-2 h-2 rounded-full ">
                        </span>
                    </div>
                )
            }
        </div>
    )
}
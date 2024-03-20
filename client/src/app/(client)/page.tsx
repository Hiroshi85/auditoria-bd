import { API_HOST } from "@/constants/server"
import { getLastConnection } from "@/server/get-connection"
import { fetcheServer } from "@/server/server-fetch"
import axios from "axios"
import { TablesProvider } from "./partials/tables.context"
import TableElement from "./partials/list-tables"
import TableDetails from "./partials/table-details"

interface TablesResponse {
    tables: string[]
}

export default async function Page() {
    const connection = await getLastConnection()

    if (connection.id == 0) return "Connexión requerida"

    let data = {
        tables: []
    } as TablesResponse

    try {
        data = (await fetcheServer(`${API_HOST}/aud/connection/${connection.id}/tables`)).data
    } catch(e){

    }

    return (
        <TablesProvider data={data.tables}>
            <div className="container mx-auto">
                <div className="flex w-full">

                    <div className="bg-accent rounded-md py-5 px-3 max-w-[250px] space-y-2 max-h-[calc(100dvh-100px)] overflow-y-auto">

                        {
                            data.tables.map((value, index) => {
                                return (
                                    <TableElement key={value} table={value} />
                                )
                            })
                        }
                        
                    </div>

                    <div className="flex -1">
                        <TableDetails />
                    </div>

                </div>
            </div>
        </TablesProvider>
    )
}
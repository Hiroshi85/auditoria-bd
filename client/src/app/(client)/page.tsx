import { API_HOST } from "@/constants/server";
import { getLastConnection } from "@/server/get-connection";
import { fetcheServer } from "@/server/server-fetch";
import { TablesProvider } from "./partials/tables.context";
import ListTables from "./partials/list-tables";
import TableDetails from "./partials/table-details";
import { UnplugIcon } from "lucide-react";

export interface TablesResponse {
  tables: string[];
}

export default async function Page() {
  const connection = await getLastConnection();

  if (connection.id == 0)
    return (
      <div className="container w-full h-[calc(100vh-148px)] grid place-content-center">
        <div className="flex flex-col items-center text-muted-foreground">
          <UnplugIcon size={140}/>
          <span className="font-semibold text-lg">Conexión requerida</span>
        </div>
      </div>
    );

  let data = {
    tables: [],
  } as TablesResponse;

  try {
    data = (
      await fetcheServer(`${API_HOST}/aud/connection/${connection.id}/tables`)
    ).data;
  } catch (e) {}

  return (
    <TablesProvider data={data.tables}>
      <div className="container mx-auto">
        <div className="flex w-full">
          <ListTables tables={data.tables} />

          <div className="flex-1">
            <TableDetails />
          </div>
        </div>
      </div>
    </TablesProvider>
  );
}

import Nav from "@/components/layout/nav/nav";
import { API_COOKIES } from "@/constants/cookies";
import { API_HOST } from "@/constants/server";
import { ConnectionDatabaseProvider, ConnectionProvider } from "@/providers/connection";
import { getToken } from "@/server/token";
import axios from "axios";

export default async function Layout({
    children
}: {
    children: React.ReactNode;
}) {

    let data = {
        engine: "sqlserver",
        name: "",
        host: "localhost",
        port: 1433,
        username: "sa",
        id: 0
    } as ConnectionProvider

    try {
        const lastConnection = await axios.get(`${API_HOST}/aud/get/last`, {
            headers: {
                Cookie: `${API_COOKIES}=${getToken()?.value}`
            }
        })

        data = lastConnection.data as ConnectionProvider
    }catch (e) {

    }

    return (
        <div className="min-h-dvh w-full relative flex flex-col">
            <ConnectionDatabaseProvider data={data}>
                <Nav />
                <div className="flex-1 py-5">
                    {children}
                </div>
            </ConnectionDatabaseProvider>
        </div>
    )
}
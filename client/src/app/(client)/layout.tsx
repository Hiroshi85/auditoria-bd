import Nav from "@/components/layout/nav/nav";
import { ConnectionDatabaseProvider, ConnectionProvider } from "@/providers/connection";
import { getLastConnection } from "@/server/get-connection";
import CurrentConnection from "./partials/curr-connection";
import Providers from "@/providers/providers";

export default async function Layout({
    children
}: {
    children: React.ReactNode;
}) {
    const lastConnection = await getLastConnection()

    return (
        <div className="min-h-dvh w-full relative flex flex-col">
            <Providers>
                <ConnectionDatabaseProvider data={lastConnection}>
                    <Nav />
                    <div className="flex-1 py-5">
                        <div className="container mx-auto max-w-2xl mb-5">
                            <CurrentConnection connection={lastConnection}/>
                        </div>
                        {children}
                    </div>
                </ConnectionDatabaseProvider>
            </Providers>
        </div>
    )
}
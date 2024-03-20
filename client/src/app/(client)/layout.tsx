import Nav from "@/components/layout/nav/nav";
import { ConnectionDatabaseProvider, ConnectionProvider } from "@/providers/connection";
import { getLastConnection } from "@/server/get-connection";

export default async function Layout({
    children
}: {
    children: React.ReactNode;
}) {
    const lastConnection = await getLastConnection()

    return (
        <div className="min-h-dvh w-full relative flex flex-col">
            <ConnectionDatabaseProvider data={lastConnection}>
                <Nav />
                <div className="flex-1 py-5">
                    {children}
                </div>
            </ConnectionDatabaseProvider>
        </div>
    )
}
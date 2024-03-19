import Nav from "@/components/layout/nav/nav";
import { ConnectionDatabaseProvider } from "@/providers/connection";

export default function Layout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh w-full relative flex flex-col">
            <ConnectionDatabaseProvider>
                <Nav />
                <div className="flex-1 py-5">
                    {children}
                </div>
            </ConnectionDatabaseProvider>
        </div>
    )
}
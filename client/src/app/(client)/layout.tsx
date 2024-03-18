import Nav from "@/components/layout/nav/nav";

export default function Layout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh w-full relative flex flex-col">
            <Nav />
            <div className="bg-accent flex-1 py-5">
                {children}
            </div>
        </div>
    )
}
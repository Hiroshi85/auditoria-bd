import { Metadata } from "next";
import ResultadosList from "./partials/list";

export const metadata: Metadata = {
    title: 'Resultados - Database Auditor',
};

export default async function Page() {
    return (
        <ResultadosList />
    );
}

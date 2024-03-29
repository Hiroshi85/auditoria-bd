import { Metadata } from "next"
import SecuencialidadForm from "./partials/form"


export const metadata: Metadata = {
    title: 'Secuencialidad - Database Auditor',
}

type Props = {
    searchParams: { table: string }
} 

export default function Page(
    { searchParams }:
    Props
) {
    const { table } = searchParams

    return (
        <section className="container space-y-5">
            <header>
                <h1 className="text-3xl font-bold">Excepción de registros secuenciales</h1> 
                <h2 className="text-xl">{`Tabla ${table}`}</h2>  
            </header>

            <article>
                <SecuencialidadForm table={table} />
            </article>  

            <article>
                Resultados
            </article>
        </section>
    )
}
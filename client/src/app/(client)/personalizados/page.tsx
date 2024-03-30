import { Metadata } from "next"
import CustomExceptionForm from "./partials/form";
import CustomExceptionResults from "./partials/results";

export const metadata: Metadata = {
    title: 'Personalizadas - Database Auditor',
}

type Props = {
    searchParams: { table: string };
  };

export default function Page(
    { searchParams } : Props
) {
    const { table } = searchParams;

    return (
        <section className="container space-y-5">
        <header>
          <h1 className="text-3xl font-bold">
            Excepciones personalizadas
          </h1>
          <h2 className="text-xl">{`Tabla ${table}`}</h2>
        </header>

        <article>
         <CustomExceptionForm />
        </article>

        <article className="flex flex-col">
          <h2 className="text-xl font-bold">Resultados</h2>
          <CustomExceptionResults />
        </article>
      </section>
    )
}
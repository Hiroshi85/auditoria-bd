import { Metadata } from "next";
import SecuencialidadForm from "./partials/form/form";
import { SecuencialProvider } from "./secuencia.context";
import SeqExceptionResults from "./partials/results";

export const metadata: Metadata = {
  title: "Secuencialidad - Sistema Auditoría",
};

type Props = {
  searchParams: { table: string };
};

export default function Page({ searchParams }: Props) {
  const { table } = searchParams;

  return (
    <SecuencialProvider>
      <section className="container space-y-5">
        <header>
          <h1 className="text-3xl font-bold">
            Excepción de registros secuenciales
          </h1>
          <h2 className="text-xl">{`Tabla ${table}`}</h2>
        </header>

        <article>
          <SecuencialidadForm table={table} />
        </article>

        <article className="flex flex-col">
          <h2 className="text-xl font-bold">Resultados</h2>
          <SeqExceptionResults />
        </article>
      </section>
    </SecuencialProvider>
  );
}

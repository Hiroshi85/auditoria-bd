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
      <section className="space-y-5 container">
          <header>
            <h1 className="text-3xl font-bold">
              Excepción de registros secuenciales
            </h1>
            <h2 className="text-xl">{`Tabla ${table}`}</h2>
          </header>

          <article>
            <SecuencialidadForm table={table} />
          </article>

        <SeqExceptionResults />
      </section>
    </SecuencialProvider>
  );
}

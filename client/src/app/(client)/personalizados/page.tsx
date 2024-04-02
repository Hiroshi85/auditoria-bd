import { Metadata } from "next";
import { getLastConnection } from "@/server/get-connection";
import CustomExceptionForm from "./partials/form/form";
import CustomExceptionResults from "./partials/results";
import { PersonalizadasProvider } from "./personalizados.context";

export const metadata: Metadata = {
  title: "Personalizadas - Database Auditor",
};

type Props = {
  searchParams: { table: string };
};

export default async function Page({ searchParams }: Props) {
  const { table } = searchParams;
  const lastConnection = await getLastConnection();

  return (
    <PersonalizadasProvider>
      <section className="container space-y-5">
        <header>
          <h1 className="text-3xl font-bold">Excepciones personalizadas</h1>
          <h2 className="text-xl">{`Tabla ${table}`}</h2>
        </header>

        <article>
          <CustomExceptionForm engine={lastConnection?.engine} />
        </article>

        <article className="flex flex-col">
          <h2 className="text-xl font-bold">Resultados</h2>
          <CustomExceptionResults />
        </article>
      </section>
    </PersonalizadasProvider>
  );
}

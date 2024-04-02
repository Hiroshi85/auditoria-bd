import IntegridadCamposForm from "./partials/form";

import { Metadata } from "next";
import IntegridadCamposResults from "./partials/results";
import { CamposProvider } from "./campos.context";

export const metadata: Metadata = {
  title: "Integridad Campos - Database Auditor",
};

export default async function Page() {
  return (
    <>
      <CamposProvider>
        <main className="container space-y-3">
          <IntegridadCamposForm />
          <IntegridadCamposResults />
        </main>
      </CamposProvider>
    </>
  );
}

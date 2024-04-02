"use client";
import { DataTable } from "@/components/layout/table/table-details";
import { VerificarIntegridadDeCamposResponse } from "@/types/excepciones/integridad/campo";
import React from "react";
import { columns } from "./columns";
import { useCamposContext } from "../campos.context";
import { ResultContainer } from "@/components/ui/result-container";
import { Spinner } from "@/components/ui/spinner";
import { Condicion } from "./conditions";

interface Props {
  response: VerificarIntegridadDeCamposResponse;
}

const IntegridadCamposResults = () => {
  const { query } = useCamposContext();
  const { data, isLoading, isError } = query;

  if (isLoading) {
    return (
      <ResultContainer className="grid place-content-center w-full py-5">
        <p className="text-accent text-center">
          <Spinner />
        </p>
      </ResultContainer>
    );
  }

  if (isError) {
    return (
      <ResultContainer type="error" className="w-full py-5">
        <p className="text-red-500 text-center">
          Error al cargar los resultados
        </p>
      </ResultContainer>
    );
  }

  if (!data) {
    return (
      <ResultContainer className="w-full py-5">
        <p className="text-center">
          Aquí se mostrarán los resultados de la ejecución
        </p>
      </ResultContainer>
    );
  }

  if (data.error) {
    return (
      <ResultContainer type={"error"} className="w-full py-5">
        <p className="text-red-500 text-center">{data.error}</p>
      </ResultContainer>
    );
  }

  return (
    <section className="flex flex-col gap-3 w-full my-5">
      {/* {JSON.stringify(data.data)} */}
      <h3 className="text-xl font-medium">Resultados</h3>
      <ResultContainer
        type={data.data && data.data.num_rows_exceptions > 0 ? "error" : "ok"}
        className="md:rounded-md bg-accent p-5 flex flex-col gap-3"
      >
        <div className="flex flex-wrap justify-between [&>div]:flex [&>div]:flex-wrap [&>div]:gap-x-3">
          <div>
            <span className="font-bold">Base de datos:</span>
            <span>{data.data?.table}</span>
          </div>
          <div>
            <span className="font-bold">Fecha Y Hora :</span>
            <span>{new Date().toLocaleString()}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="font-bold">Tabla:</span>
          <span>{data.data?.table}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Condiciones</span>
          <div className="flex gap-4 overflow-x-scroll overflow-hidden snap-x pb-2"
            style={{ scrollbarWidth: "thin" }}
          >
            <Condicion columna="Id" condiciones={["Longitud < 40", "Único"]} />
            <Condicion columna="Sexo" condiciones={["Valores aceptados: M, F", "No nulo"]} />
            <Condicion columna="Edad" condiciones={["Valor > 18", "xdadaw"]} />
            <Condicion columna="Edad" condiciones={["Longitud < 40", "xd"]} />
            <Condicion columna="created_at" condiciones={["Longitud < 40", "xd"]} />
            <Condicion columna="updated_at" condiciones={["Longitud < 40", "xd"]} />
            <Condicion columna="Id" condiciones={["Longitud < 40", "xd"]} />
            <Condicion columna="Id" condiciones={["Longitud < 40", "xd"]} />
          </div>
        </div>
        {data.data && data.data.num_rows_exceptions > 0 && (
          <DataTable
            columns={columns(data.data.results)}
            data={data.data.results}
          />
        )}
        {data.data && data.data.num_rows_exceptions === 0 && (
          <p>No se encontraron excepciones</p>
        )}
      </ResultContainer>
    </section>
  );
};

export default IntegridadCamposResults;

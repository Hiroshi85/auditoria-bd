"use client";
import Spinner from "@/components/ui/spinner";

export default function CustomExceptionResults() {
  return (
    <div className={"flex flex-col bg-accent w-full rounded-lg p-4 border"}>
      <p>Aquí se mostrarán los resultados de la ejecución</p>
      <Spinner />
    </div>
  );
}

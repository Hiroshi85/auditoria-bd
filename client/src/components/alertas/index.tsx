'use client'

import { ShieldAlert, ShieldCheck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { ALERTAS } from "@/constants/alertas"

type Props = {
    tipoExcepcion: "Secuencial" | "De Campos" | "De Tabla"
}
const Alertas = (
    { tipoExcepcion }: Props
) => {
    return (

        <>

            <Alert
                variant="default"
                className="bg-yellow-100 p-4 rounded-lg mt-4"
            >
                <ShieldAlert />
                <AlertTitle>Posibles Causas</AlertTitle>
                <AlertDescription className="text-sm">
                    <>
                        {ALERTAS[tipoExcepcion].causas.map((item) => {
                            return (
                                <>
                                    <span className="">
                                        {item}. {" "}
                                    </span>
                                </>
                            )
                        })}
                    </>
                </AlertDescription>
            </Alert>
            <Alert
                variant="default"
                className="bg-emerald-100 p-4 rounded-lg mt-4"
            >
                <ShieldCheck />
                <AlertTitle>Acciones</AlertTitle>
                <AlertDescription className="text-sm">
                    <>
                        {ALERTAS[tipoExcepcion].acciones.map((item) => {
                            return (
                                <>
                                    <span className="">
                                        {item}. {" "}
                                    </span>
                                </>
                            )
                        })}
                    </>
                </AlertDescription>
            </Alert>
        </>
    )
}

export default Alertas
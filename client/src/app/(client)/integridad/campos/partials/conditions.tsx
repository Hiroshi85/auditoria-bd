import { CheckCircle2 } from "lucide-react"

interface Props {
    columna: string,
    condiciones: string[]
}

export function Condicion(
    { columna, condiciones }: Props
){
    return (
        <div className="bg-white rounded-xl px-4 py-2 flex items-center gap-2 min-w-[200px] snap-center">
            <CheckCircle2 size={24} />
            <div className="flex flex-col">
                <h2 className="text-gray-700 font-bold">{columna}</h2>
                <ul className="text-xs text-muted-foreground flex divide-x">
                    {condiciones.join(", ")}
                </ul>
            </div>
        </div>
    )
}
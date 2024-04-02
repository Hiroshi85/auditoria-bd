import { CONDICIONES, CONDICIONES_ENUM } from "@/constants/integridad/campos/condiciones"

export const obtenerCondicionesDelTipo = (tipo: 'numerico' | 'cadena' | 'tiempo' | 'enum') => {
    const where = CONDICIONES.find(condicion => condicion.name === 'Where');
    if (!where) return null;
    return where.condicion ? where.condicion[tipo] : null;
}

export const obtenerCondicionesDeLongitud = () => {
    const where = CONDICIONES.find(condicion => condicion.name === 'Where');
    if (!where) return [];
    return where.condicion ? where.condicion.cadena?.find(condicion => condicion.name === 'longitud')?.condiciones ?? [] : [];
}

const obtenerUnSoloArregloDeCondicionesWhere = () => {
    const where = CONDICIONES.find(condicion => condicion.name === 'Where');
    if (!where) return [];
    return [
        ...where.condicion?.numerico ?? [],
        ...where.condicion?.cadena ?? [],
        ...where.condicion?.tiempo ?? [],
        ...where.condicion?.enum ?? []
    ];
}


type Condicion = {
    condicion: 'Where' | 'No Nulo' | 'Único';
    condicion_id: number;
    condicion_where_id?: number;
    valor_uno: string;
    valor_dos?: string;
    condicion_longitud?: number;
}
export const obtenerStringDeCondicion = ({
    condicion_id,
    condicion_where_id,
    valor_uno,
    valor_dos,
    condicion_longitud
}: Condicion) => {
    switch (condicion_id) {
        case CONDICIONES_ENUM.Where.id:
            const condicionesWhere = obtenerUnSoloArregloDeCondicionesWhere();
            const condicion_where_nombre = condicionesWhere.find(condicion => condicion.id === condicion_where_id)?.title;

            if (condicion_longitud) {
                const condicion_longitud_nombre = obtenerCondicionesDeLongitud().find(condicion => condicion.id === condicion_longitud)?.title;
                return `${condicion_where_nombre} ${condicion_longitud_nombre} ${valor_uno}`;
            }
            return `${condicion_where_nombre} ${valor_uno} ${valor_dos ? valor_dos : ''}`;
        case CONDICIONES_ENUM.NoNulo.id:
            return 'No nulo';
        case CONDICIONES_ENUM.Unico.id:
            return 'Único';
        default:
            return '';
    }
}
import { CONDICIONES } from "@/constants/integridad/campos/condiciones"

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

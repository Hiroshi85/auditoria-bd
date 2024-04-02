interface ColumnaAVerificar {
    nombre: string;
    tipo: string; // numerico, cadena, fecha
    tipo_de_dato_id: number;
    tipo_de_dato: string; // int, varchar, date
    condicion_id: number;
    condicion: string; // UNICO, NO NULO, WHERE
    where?: {
        condicion_id: number;
        nombre: string;
        valor_uno: string;
        valor_dos?: string;
        longitud?: {
            longitud_condicion_id: number;
            nombre: string;
        }
    };

}
export interface VerificarIntegridadDeCamposRequest {
    table: string;
    connectionId: number;
    columnas: ColumnaAVerificar[];
}

export type VerificarIntegridadDeCamposResponse = {
    error: string | null;
    data: {
        num_rows_exceptions: number;
        table: string;
        database: string;
        accessed_on: string;
        conditions: {
            [key: string]: {
                condicion: 'Where' | 'No Nulo' | 'Único';
                condicion_id: number;
                condicion_where_id?: number;
                valor_uno: string;
                valor_dos?: string;
                condicion_longitud?: number;
            }[];
        }
        results: {
            [key: string]: string | number | null;
        }[];
    } | null;
}
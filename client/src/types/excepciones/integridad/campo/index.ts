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
        valor_uno: number;
        valor_dos: number;
        longitud?: {
            longitud_condicion_id: number;
            nombre: string;
            valor_uno: number;
            valor_dos: number;
        }
    };

}
export interface VerificarIntegridadDeCamposRequest {
    table: string;
    data: ColumnaAVerificar[];
}
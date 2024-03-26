import { TIPOS_DE_DATOS, TipoDatoType } from "@/constants/integridad/campos/tipos-datos";
const formatearCadena = (cadena: string): string => {
    // Eliminamos caracteres que no son letras ni espacios
    const soloLetras = cadena.replace(/[^a-zA-Z\s]/g, '');
    // Tomamos solo la primera palabra
    const primeraPalabra = soloLetras.split(' ')[0];
    return primeraPalabra.toLowerCase();
}

export const obtenerTipoDatoSQL = (cadena: string): TipoDatoType | null => {
    cadena = formatearCadena(cadena);
    const tipoDatoEncontrado = TIPOS_DE_DATOS.find(tipoDato => tipoDato.name.toLowerCase() === cadena);
    return tipoDatoEncontrado ? tipoDatoEncontrado : null;
}

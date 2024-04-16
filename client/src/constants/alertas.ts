import { EXCEPCIONES_ENUM } from "./expeciones";
export const ALERTAS = {
    [EXCEPCIONES_ENUM.Secuencial.nombre]: {
        causas: [
            "Posible eliminación intencional de registros de la tabla",
            "Posibles errores en transacciones con inserción"
        ],
        acciones: ["Revisión de logs generados por gestor de BD evaluado"],
    },
    [EXCEPCIONES_ENUM.DeCampos.nombre]: {
        causas: [
            "Incorrecta sanitización y/o validación de entradas en aplicaciones",
            "Posible discordancia entre diseño de tablas e implementación actual de estas en la BD"

        ],
        acciones: ["Revisar lógica de inserción y actualización de datos en procedimientos almacenados o lógica de aplicación"],
    },
    [EXCEPCIONES_ENUM.DeTabla.nombre]: {
        causas: [
            "No existe restricción de integridad relacional en los campos seleccionados",
            "No se duplica valores entre tablas por problemas en la lógica de inserción"
        ],
        acciones: ["Revisar restricciones de integridad en la BD"],
    },

} as const;
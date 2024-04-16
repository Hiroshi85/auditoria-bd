export const EXCEPCIONES = [
    { id: 1, nombre: 'Secuencial' },
    { id: 2, nombre: 'De Campos' },
    { id: 3, nombre: 'De Tabla' },
    { id: 4, nombre: 'Personalizado' },
];

export const EXCEPCIONES_ENUM = {
    Secuencial: {
        id: 1,
        nombre: 'Secuencial'
    },
    DeCampos: {
        id: 2,
        nombre: 'De Campos'
    },
    DeTabla: {
        id: 3,
        nombre: 'De Tabla'
    },
    Personalizado: {
        id: 4,
        nombre: 'Personalizado'
    }
} as const;
interface CondicionType {
    id: number;
    name: string;
    condicion?: {
        numerico?: Condicion[];
        cadena?: Condicion[];
        tiempo?: Condicion[];
        enum?: Condicion[];
    };
}

interface Condicion {
    id: number;
    name: string;
    title: string;
    condiciones?: Condicion[];
}
export const CONDICIONES: CondicionType[] = [
    {
        id: 1,
        name: 'No Nulo',
    },
    {
        id: 2,
        name: 'Único'
    },

    {
        id: 3,
        name: 'Where',
        condicion: {
            numerico: [
                {
                    id: 1,
                    name: 'mayor',
                    title: 'Mayor a'
                },
                {
                    id: 2,
                    name: 'mayorIgual',
                    title: 'Mayor o igual a'
                },
                {
                    id: 3,
                    name: 'menor',
                    title: 'Menor a'
                },
                {
                    id: 4,
                    name: 'menorIgual',
                    title: 'Menor o igual a'
                },
                {
                    id: 5,
                    name: 'igual',
                    title: 'Igual a'
                },
                {
                    id: 6,
                    name: 'diferente',
                    title: 'Diferente a'
                },
                {
                    id: 7,
                    name: 'entre',
                    title: 'Entre'
                },
            ],
            cadena: [
                {
                    id: 8,
                    name: 'igual',
                    title: 'Igual a'
                },
                {
                    id: 9,
                    name: 'diferente',
                    title: 'Diferente a'
                },
                {
                    id: 10,
                    name: 'contiene',
                    title: 'Contiene'
                },
                {
                    id: 11,
                    name: 'empieza',
                    title: 'Empieza con'
                },
                {
                    id: 12,
                    name: 'termina',
                    title: 'Termina con'
                },
                {
                    id: 13,
                    name: 'valores_aceptados',
                    title: 'Valores aceptados'
                },
                {
                    id: 14,
                    name: 'regex',
                    title: 'Expresión regular'
                },
                {
                    id: 15,
                    name: 'longitud',
                    title: 'Longitud',
                    condiciones: [
                        {
                            id: 1,
                            name: 'mayor',
                            title: 'Mayor a'
                        },
                        {
                            id: 2,
                            name: 'mayorIgual',
                            title: 'Mayor o igual a'
                        },
                        {
                            id: 3,
                            name: 'menor',
                            title: 'Menor a'
                        },
                        {
                            id: 4,
                            name: 'menorIgual',
                            title: 'Menor o igual a'
                        },
                        {
                            id: 5,
                            name: 'igual',
                            title: 'Igual a'
                        },
                        {
                            id: 6,
                            name: 'diferente',
                            title: 'Diferente a'
                        },
                        {
                            id: 7,
                            name: 'entre',
                            title: 'Entre'
                        },
                    ]
                }
            ],
            tiempo: [
                {

                    id: 16,
                    name: 'anterior',
                    title: 'Antes de'
                },
                {

                    id: 17,
                    name: 'posterior',
                    title: 'Después de'
                },
                {

                    id: 18,
                    name: 'entreFechas',
                    title: 'Entre Fechas'
                },
                {

                    id: 19,
                    name: 'igualFecha',
                    title: 'Igual a'
                },
                {

                    id: 20,
                    name: 'rangoHoras',
                    title: 'Rango de Horas'
                },
                {

                    id: 21,
                    name: 'diaSemana',
                    title: 'Día de Semana'
                },
                {

                    id: 22,
                    name: 'mes',
                    title: 'Mes'
                },
                {

                    id: 23,
                    name: 'año',
                    title: 'Año'
                },
            ],
            enum: [
                {
                    id: 24,
                    name: 'valores_aceptados',
                    title: 'Valores aceptados'
                }
            ]
        }
    }
]

export const CONDICIONES_ENUM = {
    NoNulo: {
        id: 1,
        name: 'No Nulo',
        index: 0
    },
    Unico: {
        id: 2,
        name: 'Único',
        index: 1
    },
    Where: {
        id: 3,
        name: 'Where',
        index: 2
    }
}
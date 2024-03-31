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
                    name: 'menor',
                    title: 'Menor a'
                },
                {
                    id: 3,
                    name: 'igual',
                    title: 'Igual a'
                },
                {
                    id: 4,
                    name: 'entre',
                    title: 'Entre'
                },
                {
                    id: 5,
                    name: 'mayorIgual',
                    title: 'Mayor o igual a'
                },
                {
                    id: 6,
                    name: 'menorIgual',
                    title: 'Menor o igual a'
                }
            ],
            cadena: [
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
                    name: 'contiene',
                    title: 'Contiene'
                },
                {
                    id: 8,
                    name: 'empieza',
                    title: 'Empieza con'
                },
                {
                    id: 9,
                    name: 'termina',
                    title: 'Termina con'
                },
                {
                    id: 10,
                    name: 'valores_aceptados',
                    title: 'Valores aceptados'
                },
                {
                    id: 11,
                    name: 'regex',
                    title: 'Expresión regular'
                },
                {
                    id: 12,
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
                            name: 'menor',
                            title: 'Menor a'
                        },
                        {
                            id: 3,
                            name: 'igual',
                            title: 'Igual a'
                        },
                        {
                            id: 4,
                            name: 'entre',
                            title: 'Entre'
                        },
                        {
                            id: 5,
                            name: 'mayorIgual',
                            title: 'Mayor o igual a'
                        },
                        {
                            id: 6,
                            name: 'menorIgual',
                            title: 'Menor o igual a'
                        }
                    ]
                }
            ],
            tiempo: [
                {

                    id: 13,
                    name: 'anterior',
                    title: 'Antes de'
                },
                {

                    id: 14,
                    name: 'posterior',
                    title: 'Después de'
                },
                {

                    id: 15,
                    name: 'entreFechas',
                    title: 'Entre Fechas'
                },
                {

                    id: 16,
                    name: 'igualFecha',
                    title: 'Igual a'
                },
                {

                    id: 17,
                    name: 'rangoHoras',
                    title: 'Rango de Horas'
                },
                {

                    id: 18,
                    name: 'diaSemana',
                    title: 'Día de Semana'
                },
                {

                    id: 19,
                    name: 'mes',
                    title: 'Mes'
                },
                {

                    id: 20,
                    name: 'año',
                    title: 'Año'
                },
            ],
            enum: [
                {
                    id: 21,
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
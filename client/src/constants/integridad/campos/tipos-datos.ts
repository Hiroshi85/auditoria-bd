export type TipoDatoType = {
    id: number;
    name: string;
    type: 'numerico' | 'cadena' | 'tiempo' | 'enum';
};

export const TIPOS_DE_DATOS: TipoDatoType[] =
    [
        {
            id: 1,
            name: 'INT',
            type: 'numerico'
        },
        {
            id: 2,
            name: 'INTEGER',
            type: 'numerico'
        },
        {
            id: 3,
            name: 'TINYINT',
            type: 'numerico'
        },
        {
            id: 4,
            name: 'SMALLINT',
            type: 'numerico'
        },
        {
            id: 5,
            name: 'MEDIUMINT',
            type: 'numerico'
        },
        {
            id: 6,
            name: 'BIGINT',
            type: 'numerico'
        },
        {
            id: 7,
            name: 'FLOAT',
            type: 'numerico'
        },
        {
            id: 8,
            name: 'DOUBLE',
            type: 'numerico'
        },
        {
            id: 9,
            name: 'DECIMAL',
            type: 'numerico'
        },
        {
            id: 10,
            name: 'NUMERIC',
            type: 'numerico'
        },
        {
            id: 11,
            name: 'REAL',
            type: 'numerico'
        },
        {
            id: 12,
            name: 'SMALLMONEY',
            type: 'numerico'
        },
        {
            id: 13,
            name: 'MONEY',
            type: 'numerico'
        },
        {
            id: 14,
            name: 'BIT',
            type: 'numerico'
        },
        {
            id: 15,
            name: 'CHAR',
            type: 'cadena'
        },
        {
            id: 16,
            name: 'VARCHAR',
            type: 'cadena'
        },
        {
            id: 17,
            name: 'TEXT',
            type: 'cadena'
        },
        {
            id: 18,
            name: 'NCHAR',
            type: 'cadena'
        },
        {
            id: 19,
            name: 'NVARCHAR',
            type: 'cadena'
        },
        {
            id: 20,
            name: 'NTEXT',
            type: 'cadena'
        },
        {
            id: 21,
            name: 'JSON',
            type: 'cadena'
        },
        {
            id: 22,
            name: 'LONGTEXT',
            type: 'cadena'
        },
        {
            id: 23,
            name: 'DATE',
            type: 'tiempo'
        },
        {
            id: 24,
            name: 'TIME',
            type: 'tiempo'
        },
        {
            id: 25,
            name: 'DATETIME',
            type: 'tiempo'
        },
        {
            id: 26,
            name: 'TIMESTAMP',
            type: 'tiempo'
        },
        {
            id: 27,
            name: 'YEAR',
            type: 'tiempo'
        },
        {
            id: 28,
            name: 'DATETIME2',
            type: 'tiempo'
        },
        {
            id: 29,
            name: 'DATETIMEOFFSET',
            type: 'tiempo'
        },
        {
            id: 30,
            name: 'ENUM',
            type: 'enum'
        }
    ]
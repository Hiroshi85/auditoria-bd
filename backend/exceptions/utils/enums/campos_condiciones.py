from enum import Enum

class Condicion(Enum):
    #Enumeración de las condiciones
    NOT_NULL=1
    UNIQUE=2
    WHERE=3

class Tipo_Dato(str, Enum):
    CADENA = "cadena"
    NUMERICO = "numerico"
    TIEMPO = "tiempo"
    ENUM = "enum"

class WhenNumerico(Enum):
    MAYOR=1
    MAYOR_IGUAL=2
    MENOR=3
    MENOR_IGUAL=4
    IGUAL=5
    DIFERENTE=6
    ENTRE=7

class WhenCadena(Enum):
    IGUAL=8
    DIFERENTE=9
    CONTIENE=10
    EMPIEZA_CON=11
    TERMINA_CON=12
    ACEPTA=13
    REGEX=14
    LONGITUD=15

class WhenTiempo(Enum):
    ANTES=16
    DESPUES=17
    ENTRE=18
    IGUAL=19
    ENTRE_HORAS=20
    DIA_SEMANA=21
    MES=22
    AÑO=23

class WhenEnum(Enum):
    ACEPTA=24
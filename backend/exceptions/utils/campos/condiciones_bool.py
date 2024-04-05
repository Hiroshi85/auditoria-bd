from sqlalchemy.sql import null
from sqlalchemy import Date, Time, func, extract, cast
from datetime import datetime

from exceptions.utils.enums.bd_engines import DbEngine
from ..enums.campos_condiciones import Condicion, WhenNumerico, WhenCadena, WhenTiempo, WhenEnum, Tipo_Dato

def definir_condicion_general(campo, columna, db_name):
    id_condicion_general = int(columna["condicion_id"])

    if(id_condicion_general == Condicion.NOT_NULL.value):
        return campo != null()
    
    if(id_condicion_general == Condicion.WHERE.value):
        return definir_condicion_where(campo, columna, db_name)

def definir_condicion_where(campo, columna, db_name):
    tipo = columna["tipo"]
    id_condicion_where = int(columna["where"]["condicion_id"])

    valor_1 = columna["where"]["valor_uno"]
    valor_2 = columna["where"]["valor_dos"]

    if(tipo == Tipo_Dato.NUMERICO.value):
        return obtener_bool_numerico(campo, id_condicion_where, valor_1, valor_2)
    
    if(tipo == Tipo_Dato.CADENA.value):
        id_condicion_long = int(columna["where"]["longitud"]["longitud_condicion_id"])
        return obtener_bool_cadena(campo, id_condicion_where, valor_1, valor_2, id_condicion_long)
    
    if(tipo == Tipo_Dato.TIEMPO.value):
        return obtener_bool_tiempo(campo, id_condicion_where, valor_1, valor_2, db_name)

    if(tipo == Tipo_Dato.ENUM.value):
        return obtener_bool_enum(campo, id_condicion_where, valor_1)
    
def obtener_bool_numerico(campo, id_condicion_where, valor_uno, valor_dos):
    if(id_condicion_where == WhenNumerico.MAYOR.value):
        return campo > valor_uno
        
    if(id_condicion_where == WhenNumerico.MAYOR_IGUAL.value):
        return campo >= valor_uno
    
    if(id_condicion_where == WhenNumerico.MENOR.value):
        return campo < valor_uno

    if(id_condicion_where == WhenNumerico.MENOR_IGUAL.value):
        return campo <= valor_uno

    if(id_condicion_where == WhenNumerico.IGUAL.value):
        return campo == valor_uno

    if(id_condicion_where == WhenNumerico.DIFERENTE.value):
        return campo != valor_uno

    if(id_condicion_where == WhenNumerico.ENTRE.value):
        return campo.between(valor_uno, valor_dos)

def obtener_bool_cadena(campo, id_condicion_where, valor_uno, valor_dos, id_condicion_length):
    if(id_condicion_where == WhenCadena.IGUAL.value):
        return campo == valor_uno

    if(id_condicion_where == WhenCadena.DIFERENTE.value):
        return campo != valor_uno

    if(id_condicion_where == WhenCadena.CONTIENE.value):
        return campo.like(f"%{valor_uno}%")

    if(id_condicion_where == WhenCadena.EMPIEZA_CON.value):
        return campo.startswith(valor_uno)

    if(id_condicion_where == WhenCadena.TERMINA_CON.value):
        return campo.endswith(valor_uno)

    if(id_condicion_where == WhenCadena.ACEPTA.value):
        lista_valores = valor_uno.split(",")
        lista_valores_aceptados = [valor.strip() for valor in lista_valores]
        return campo.in_(lista_valores_aceptados)

    if(id_condicion_where == WhenCadena.REGEX.value):
        return campo.regexp_match(valor_uno)

    if(id_condicion_where == WhenCadena.LONGITUD.value):
        len_campo = func.char_length(campo)
        return obtener_bool_numerico(len_campo, id_condicion_length, valor_uno, valor_dos)

def obtener_bool_tiempo(campo, id_condicion_where, valor_uno, valor_dos, db_name):
    if(id_condicion_where == WhenTiempo.ANTES.value):
        valor_uno_date = str(datetime.strptime(valor_uno, '%Y-%m-%d').date())
        return cast(campo, Date) < valor_uno_date

    if(id_condicion_where == WhenTiempo.DESPUES.value):
        valor_uno_date = str(datetime.strptime(valor_uno, '%Y-%m-%d').date())
        return cast(campo, Date)  > valor_uno_date

    if(id_condicion_where == WhenTiempo.ENTRE.value):
        valor_uno_date = str(datetime.strptime(valor_uno, '%Y-%m-%d').date())
        valor_dos_date = str(datetime.strptime(valor_dos, '%Y-%m-%d').date())
        return cast(campo, Date).between(valor_uno_date, valor_dos_date) 

    if(id_condicion_where == WhenTiempo.IGUAL.value):
        valor_uno_date = str(datetime.strptime(valor_uno, '%Y-%m-%d').date())
        return cast(campo, Date) == valor_uno_date

    if(id_condicion_where == WhenTiempo.ENTRE_HORAS.value):
        valor_uno_time = str(datetime.strptime(valor_uno, '%H:%M').time())
        valor_dos_time = str(datetime.strptime(valor_dos, '%H:%M').time())    
        return cast(campo, Time).between(valor_uno_time, valor_dos_time)

    if(id_condicion_where == WhenTiempo.DIA_SEMANA.value):
        valor_uno_weekday = valor_uno
        if(DbEngine.MYSQL.value == db_name):
            valor = func.dayofweek(campo) == valor_uno_weekday
        if(DbEngine.SQL_SERVER.value == db_name):
            valor = extract('weekday', campo) == valor_uno_weekday
        return valor

    if(id_condicion_where == WhenTiempo.MES.value):
        valor_uno_month = valor_uno
        return extract('month', campo) == valor_uno_month

    if(id_condicion_where == WhenTiempo.AÑO.value):
        valor_uno_year = valor_uno
        return extract('year', campo) == valor_uno_year
    
def obtener_bool_enum(campo, id_condicion_where, valor_uno):
    if(id_condicion_where == WhenEnum.ACEPTA.value):
        lista_valores = valor_uno.split(",")
        lista_valores_aceptados = [valor.strip() for valor in lista_valores]
        return campo.in_(lista_valores_aceptados)
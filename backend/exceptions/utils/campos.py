from sqlalchemy.sql import null
from datetime import datetime
from .enums.secuenciales import Condicion, WhenNumerico, WhenCadena, WhenTiempo, WhenEnum, Tipo_Dato
import re

def definir_condicion_general(campo, columna):
    id_condicion_general = columna["condicion_id"]

    if(id_condicion_general == Condicion.NOT_NULL.value):
        return campo != null()
    
    if(id_condicion_general == Condicion.WHERE.value):
        return definir_condicion_where(campo, columna)

def definir_condicion_where(campo, columna):
    tipo = columna["tipo"]
    id_condicion_where = columna["where"]["condicion_id"]

    if(tipo == Tipo_Dato.NUMERICO.value):
        return obtener_bool_numerico(campo, id_condicion_where, columna["where"]["valor_uno"], columna["where"]["valor_dos"])
    
    if(tipo == Tipo_Dato.CADENA.value):
        return obtener_bool_cadena()
    
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
        return  valor_uno <= campo <= valor_dos

def obtener_bool_cadena(campo, id_condicion_where, valor_uno, id_condicion_length, valor_uno_l, valor_dos_l):
    if(id_condicion_where == WhenCadena.IGUAL.value):
        return campo == valor_uno

    if(id_condicion_where == WhenCadena.DIFERENTE.value):
        return campo != valor_uno

    if(id_condicion_where == WhenCadena.CONTIENE.value):
        return valor_uno in campo

    if(id_condicion_where == WhenCadena.EMPIEZA_CON.value):
        return campo.startswith(valor_uno)

    if(id_condicion_where == WhenCadena.TERMINA_CON.value):
        return campo.endswith(valor_uno)

    if(id_condicion_where == WhenCadena.ACEPTA.value):
        lista_valores = valor_uno.split(",")
        lista_valores_aceptados = [valor.strip() for valor in lista_valores]
        return campo in lista_valores_aceptados

    if(id_condicion_where == WhenCadena.REGEX.value):
        return bool(re.search(valor_uno, campo))

    if(id_condicion_where == WhenCadena.LONGITUD.value):
        len_campo = len(campo)
        return obtener_bool_numerico(len_campo, id_condicion_length, valor_uno_l, valor_dos_l)

def obtener_bool_tiempo(campo, id_condicion_where, valor_uno, valor_dos):
    campo_dt = datetime.strptime(campo, '%Y-%m-%d %H:%M:%S')
    valor_uno_date = datetime.strptime(valor_uno, '%Y-%m-%d').date()
    valor_dos_date = datetime.strptime(valor_dos, '%Y-%m-%d').date()
    valor_uno_time = datetime.strptime(valor_uno, '%H:%M').time()
    valor_dos_time = datetime.strptime(valor_dos, '%H:%M').time()
    
    if(id_condicion_where == WhenTiempo.ANTES.value):
        return campo_dt.date() < valor_uno_date

    if(id_condicion_where == WhenTiempo.DESPUES.value):
        return campo_dt.date()  > valor_uno_date

    if(id_condicion_where == WhenTiempo.ENTRE.value):
        return valor_uno_date <= campo_dt.date() <= valor_dos_date

    if(id_condicion_where == WhenTiempo.IGUAL.value):
        return campo_dt.date() == valor_uno_date

    if(id_condicion_where == WhenTiempo.ENTRE_HORAS.value):
        return valor_uno_time <= campo_dt.time() <= valor_dos_time

    if(id_condicion_where == WhenTiempo.DIA_SEMANA.value):
        return campo_dt.isoweekday() == valor_uno_date.isoweekday()

    if(id_condicion_where == WhenTiempo.MES.value):
        return campo_dt.month == valor_uno_date.month()

    if(id_condicion_where == WhenTiempo.AÑO.value):
        return campo_dt.year() == valor_uno_date.year()
    
def obtener_bool_enum(campo, id_condicion_where, valor_uno):
    if(id_condicion_where == WhenEnum.ACEPTA.value):
        lista_valores = valor_uno.split(",")
        lista_valores_aceptados = [valor.strip() for valor in lista_valores]
        return campo in lista_valores_aceptados
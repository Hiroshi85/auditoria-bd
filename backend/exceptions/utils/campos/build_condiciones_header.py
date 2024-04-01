from ..enums.campos_condiciones import Condicion, WhenCadena

def build_condiciones_header(columnas_todos, campo, header_list):
    if campo in header_list:
        return {}
    
    obj_a_estudiar = list(filter(lambda obj: obj["nombre"] == campo, columnas_todos))
    
    condiciones_list = []

    for columna in obj_a_estudiar:
        condicion_header = {}
        
        condicion_header["condicion"] = columna["condicion"]
        condicion_header["condicion_id"]= columna["condicion_id"]

        if(columna["condicion_id"] == Condicion.WHERE.value):
            condicion_header["condicion_where_id"] = columna["where"]["condicion_id"]
            condicion_header["valor_uno"] = columna["where"]["valor_uno"]
            condicion_header["valor_dos"] = columna["where"]["valor_dos"]

            if(columna["where"]["condicion_id"] == WhenCadena.LONGITUD.value):
                condicion_header["condicion_longitud"] = columna["where"]["longitud"]["longitud_condicion_id"]

        condiciones_list.append(condicion_header)

    return condiciones_list
        
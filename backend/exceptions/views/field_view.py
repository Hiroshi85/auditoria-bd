from rest_framework.response import Response
from sqlalchemy import not_, or_, func, case, select
from auditoria_bd_api.utils import conexiones, table_info, results_operations
from rest_framework.decorators import api_view
from ..utils.enums.tipo_excepcion import TipoExcepcion

from ..utils.campos.condiciones_bool import definir_condicion_general
from ..utils.campos.build_condiciones_header import build_condiciones_header
from datetime import datetime

@api_view(['POST'])
def obtain_valores(request, id):

    tabla_seleccionada = request.data["table"]
    columnas = request.data["columnas"]

    db, conn = conexiones.get_connection_by_id(id, request.userdb)
    tabla = table_info.get_reflected_table(db, tabla_seleccionada)

    cantidad = 0
    campos_select = []
    condiciones = []
    condiciones_where = []
    resultados = []
    condiciones_header = {}
    
    for columna in columnas:
        campo = tabla.c[columna["nombre"]]
        campos_select.append(campo)
        cond_columna = not_(definir_condicion_general(campo, columna))
        condicion_obj = {"condicion": cond_columna, "campo": columna["nombre"]}

        #Para where
        condiciones_where.append(cond_columna)

        #Para case
        condiciones.append(condicion_obj)
        
        #Para tener campos y sus condiciones
        cond_header = build_condiciones_header(columnas, columna["nombre"], condiciones_header)
        if(cond_header):
            condiciones_header[columna["nombre"]] = cond_header
        
    #Para where
    condiciones_where = [objeto['condicion'] for objeto in condiciones]

    #Para where
    condiciones_where = [objeto['condicion'] for objeto in condiciones]

    # Para select
    campos_select = list(tabla.primary_key.columns) + [tabla.c[objeto] for objeto in condiciones_header.keys()]

    #Operacion para columna adicional con case para mostrar excepciones
    expresiones_case = [ case((objeto['condicion'], f"{objeto['campo']},"), else_='') for objeto in condiciones]

    #Concatenar las expresiones de case
    columna_excepciones = func.concat(*expresiones_case).label('excepciones')

    # Realizar la consulta
    with db.connect() as connection:
        select_query = select(*campos_select).add_columns(columna_excepciones)

        query_final = select_query.where(or_(*condiciones_where))

        result = connection.execute(query_final)
        fecha_hora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        resultados = result.mappings().all()
        cantidad = len(resultados)

    db_name = db.url.database
    exception_was_raised = cantidad > 0

    response_dict = {
        'database': db_name,
        'table': tabla_seleccionada,
        'accessed_on': fecha_hora,
        'num_rows_exceptions': cantidad,
        'conditions': condiciones_header,
        'results': resultados
    }
    
    results_operations.save_results(response_dict, conn, TipoExcepcion.CAMPOS, tabla_seleccionada, exception_was_raised)

    return Response(response_dict, status=200)


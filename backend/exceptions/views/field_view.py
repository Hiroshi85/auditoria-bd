from rest_framework.response import Response
from sqlalchemy import not_, or_, func, case
from auditoria_bd_api.utils import conexiones, table_info
from rest_framework.decorators import api_view
from ..utils.campos.condiciones_bool import definir_condicion_general
from ..utils.campos.build_condiciones_header import build_condiciones_header
from datetime import datetime

@api_view(['POST'])
def obtain_valores(request, id):
    tabla_seleccionada = request.data["table"]
    columnas = request.data["columnas"]

    db, _ = conexiones.get_connection_by_id(id, request.userdb)
    tabla = table_info.get_reflected_table(db, tabla_seleccionada)

    cantidad = 0
    condiciones = []
    condiciones_header = {}
    
    for columna in columnas:
        campo = tabla.c[columna["nombre"]]
        cond_columna = not_(definir_condicion_general(campo, columna))
        condicion_obj = {"condicion": cond_columna, "campo": columna["nombre"]}
        condiciones.append(condicion_obj)
        
        cond_header = build_condiciones_header(columnas, columna["nombre"], condiciones_header)
        if(cond_header):
            condiciones_header[columna["nombre"]] = cond_header
    
    #Para where
    condiciones_where = [objeto['condicion'] for objeto in condiciones]

    #Operacion para columna adicional con case para mostrar excepciones
    expresiones_case = [ case((objeto['condicion'], f"{objeto['campo']},"), else_='') for objeto in condiciones]

    #Concatenar las expresiones de case
    columna_excepciones = func.concat(*expresiones_case).label('excepciones')

    # Realizar una consulta simple
    with db.connect() as connection:
        select_query = tabla.select().add_columns(columna_excepciones)

        query_final = select_query.where(or_(*condiciones_where))
        print(query_final)

        result = connection.execute(query_final)
        fecha_hora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        resultados = result.mappings().all()
        cantidad = len(resultados)

    db_name = db.url.database

    return Response({
        'database': db_name,
        'table': tabla_seleccionada,
        'accessed_on': fecha_hora,
        'num_rows_exceptions': cantidad,
        'conditions': condiciones_header,
        'results': resultados
    })


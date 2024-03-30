from rest_framework.response import Response
from sqlalchemy import not_, or_, func, case
from auditoria_bd_api.utils import conexiones, table_info
from rest_framework.decorators import api_view
from ..utils.campos import definir_condicion_general

@api_view(['POST'])
def obtain_valores(request, id):
    tabla_seleccionada = request.data["table"]
    columnas = request.data["columnas"]

    db, _ = conexiones.get_connection_by_id(id, request.userdb)

    tabla = table_info.get_reflected_table(db, tabla_seleccionada)

    cantidad = 0
    condiciones = []
    
    for columna in columnas:
        campo = tabla.c[columna["nombre"]]
        cond_columna = not_(definir_condicion_general(campo, columna))
        condicion_obj = {"condicion": cond_columna, "campo": campo}
        condiciones.append(condicion_obj)
    # condiciones.append( not_(tabla.c["nro_hermanos"] >= 5))
    # condiciones.append( not_(tabla.c["estado"] == "Matriculado"))

    expresiones_case = [ case((objeto['condicion'], f"{objeto['campo']} "), else_='') for objeto in condiciones]

    expresiones_condicionales = [
        func.concat(*expresiones_case).label('excepciones')
    ]
    # expresiones_condicionales = [
    #     func.concat(
            
    #         case((not_(tabla.c["nro_hermanos"] >= 5), 'nro_hermanos '), else_=''),
    #         case((not_(tabla.c["estado"] == "Matriculado"), 'estado '), else_='')
    #     ).label('excepciones')
    # ]

    # Realizar una consulta simple
    with db.connect() as connection:
        # Ejemplo de consulta SELECT *
        select_query = tabla.select().add_columns(*expresiones_condicionales)

        query_final = select_query.where(or_(*condiciones))

        result = connection.execute(query_final)

        resultados = result.mappings().all()
        cantidad = len(resultados)

    print(resultados)

    return Response({
        'message': '¡Conexión exitosa!',
        'cantidad': cantidad,
        'data': resultados
    })


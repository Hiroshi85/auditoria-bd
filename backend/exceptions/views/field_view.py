from rest_framework.response import Response
from sqlalchemy import MetaData, Table
from auditoria_bd_api.utils import conexiones
from rest_framework.decorators import api_view

@api_view(['POST'])
def obtain_valores(request, id):
    db, _ = conexiones.get_connection_by_id(id, request.userdb)
    datos = request.data
    metadata = MetaData()

    tabla_reflejada = Table(datos["table"], metadata, autoload_with=db)
    resultados = []
    # Realizar una consulta simple
    with db.connect() as connection:
        # Ejemplo de consulta SELECT *
        select_query = tabla_reflejada.select()
        result = connection.execute(select_query)
        
        # Iterar sobre los resultados e imprimirlos
        for row in result:
            resultados.append(row._asdict())
            # print(row)
    
    print(resultados)

    return Response({
        'message': '¡Conexión exitosa!',
        'data': resultados
    })


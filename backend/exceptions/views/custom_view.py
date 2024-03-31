from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..serializrs.personalizadas.serializers import CustomExceptionSerializer
from auditoria_bd_api.utils.conexiones import get_connection_by_id

import datetime
from sqlalchemy import text


@api_view(['POST'])
def index(request, id):
    serializer = CustomExceptionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data

    table = body['table']
    query = body['query']
    task_name = body['task_name']

    db, _ = get_connection_by_id(id, request.userdb)

    query = text(query)
 
    with db.connect() as connection:
        try:
            result = connection.execute(query)
            headers = result.keys()
            data = result.mappings().all()
        except Exception as e:
            error_message = str(e.orig.args[1])
            query = str(e.statement) if hasattr(
                e, 'statement') else "No query information"
            return Response({
                'result': "error",
                'message': 'Error en la consulta SQL',
                'error': error_message,
                'query': query
            })

    resultados = {
        'headers': list(headers),
        'rows': data
    }

    return Response({
        'result': 'ok',
        'task_name': task_name,
        'query': str(query),
        'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'data': resultados
    })

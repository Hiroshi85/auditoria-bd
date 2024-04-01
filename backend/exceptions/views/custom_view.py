from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..serializrs.personalizadas.serializers import CustomExceptionSerializer
from auditoria_bd_api.utils.conexiones import get_connection_by_id

import datetime
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError


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
        except DBAPIError as e:
            return Response({
                'result': "error",
                'query': e.statement,
                'sql_error': e.orig.args[1],
                'error_code': e.orig.args[0],
                'instance_error': type(e.orig).__name__,
            })

    resultados = {
        'headers': list(headers),
        'rows': data
    }

    return Response({
        'result': 'ok',
        'table': table,
        'task_name': task_name,
        'query': str(query),
        'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'num_rows': len(data),
        'data': resultados
    })

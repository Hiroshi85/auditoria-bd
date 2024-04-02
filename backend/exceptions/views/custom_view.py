from sys import exception
from rest_framework.decorators import api_view
from rest_framework.response import Response

from exceptions.utils.enums.tipo_excepcion import TipoExcepcion

from ..serializrs.personalizadas.serializers import CustomExceptionSerializer
from auditoria_bd_api.utils.conexiones import get_connection_by_id
from auditoria_bd_api.utils.results_operations import save_results

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

    db, conn = get_connection_by_id(id, request.userdb)

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

    exception_was_raised = len(data) > 0

    response_dict = {
        'result': 'ok',
        'table': table,
        'task_name': task_name,
        'query': str(query),
        'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'num_rows': len(data),
        'data': resultados
    }

    save_results(response_dict, conn, TipoExcepcion.PERSONALIZADO, table, exception_was_raised)

    return Response(response_dict, 200)

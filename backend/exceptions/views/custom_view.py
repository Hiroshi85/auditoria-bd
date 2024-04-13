from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from exceptions.utils.enums.tipo_excepcion import TipoExcepcion

from ..serializrs.personalizadas.serializers import CustomExceptionSerializer, QueriesSerializer
from auditoria_bd_api.utils.conexiones import get_connection_by_id
from auditoria_bd_api.utils.results_operations import save_results

import datetime
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError

from ..models import CustomQueries

from ..pagination.custom_exception.pagination import CustomPagination

@api_view(['POST'])
def index(request, id):
    pagination_class = CustomPagination()

    serializer = CustomExceptionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data

    table = body['table']
    query = body['query']
    task_name = body['name']

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
        'name': task_name,
        'query': str(query),
        'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'num_rows': len(data),
        'data': resultados
    }

    save_results(response_dict, conn, TipoExcepcion.PERSONALIZADO, table, exception_was_raised)
    
    page = pagination_class.paginate_queryset(request=request, queryset=data)
    if page is not None:
        return pagination_class.get_paginated_response(page)

    return Response(response_dict, 200)

@api_view(['GET'])
def get_queries_by_user_id(request, id):
    queries = CustomQueries.objects.filter(user=request.userdb)
    response = {}
    response = QueriesSerializer(queries, many=True).data
    for query in response:
        query['connection'] = queries.get(id=query['id']).connection.id

    return Response(response , status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_query(request, id):
    try:
        query = CustomQueries.objects.get(id=id)
    except:
        return Response({"Query no encontrada"}, status=status.HTTP_404_NOT_FOUND)
    query.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST', 'PUT'])
def save_query(request, id):
    query_serializer = QueriesSerializer(data=request.data)    
    query_serializer.is_valid(raise_exception=True)

    body = query_serializer.data
    _, current_connection = get_connection_by_id(id, request.userdb)

    new_query = None
    if request.method == 'POST':
        new_query = CustomQueries(
            name=body['name'],
            query=body['query'],
            table=body['table'],
            only_this_connection=body['only_this_connection'],
            connection=current_connection,
            user=request.userdb
        )
        
    else:
        query_id = body.get('id', None)
        try:
            new_query = CustomQueries.objects.get(id=query_id)
        except Exception as e:
            return Response({"Query no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        new_query.name = body['name']
        new_query.query = body['query']
        new_query.table = body['table']
        new_query.only_this_connection = body['only_this_connection']
        new_query.connection = current_connection
        new_query.user = request.userdb
        
    new_query.save()
    return Response(QueriesSerializer(new_query).data, status=status.HTTP_201_CREATED)

    
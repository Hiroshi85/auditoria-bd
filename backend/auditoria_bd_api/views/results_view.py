import ast
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from auditoria_bd_api.models import Result

@api_view(['GET'])
def get_results_by_user(request):
    current_user = request.userdb

    results = Result.objects.filter(connection__user=current_user).values(
        'id', 'connection__name', 'table', 'created_at', 'exception_ocurred', 'exception_type__id' ,'exception_type__description'
        ).order_by('-created_at')
    
    results_list = []

    for result in results:
        results_list.append({
            'id': result['id'],
            'database': result['connection__name'],
            'table': result['table'],
            'created_at': result['created_at'],
            'exception_ocurred': 1 if result['exception_ocurred'] else 0,
            'exception_id': result['exception_type__id'],
            'exception_description': result['exception_type__description']
        })

    return Response({
        'user': current_user.id,
        'resultados': results_list,
        'message': f'¡Conexión exitosa para {current_user}!'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_result_by_id(request, id):
    current_user = request.userdb

    try:
        result = Result.objects.get(id=id, connection__user=current_user)
    except Result.DoesNotExist:
        return Response({
            'message': f'No se encontró el resultado con id {id} para el usuario {current_user}'
        }, status=status.HTTP_404_NOT_FOUND)

    return Response({
        'id': result.id,
        'user': current_user.id,
        'database': result.connection.name,
        'table': result.table,
        'created_at': result.created_at,
        'results': ast.literal_eval(result.results),
        'exception_ocurred': 1 if result.exception_ocurred else 0,
        'exception_id': result.exception_type.id,
        'exception_description': result.exception_type.description
    }, status=status.HTTP_200_OK)
    
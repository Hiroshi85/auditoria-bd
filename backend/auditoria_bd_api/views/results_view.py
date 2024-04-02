from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from auditoria_bd_api.models import Result

@api_view(['GET'])
def get_results_by_user(request):
    current_user = request.userdb

    results = Result.objects.filter(connection__user=current_user).values('id', 'table', 'created_at', 'exception_ocurred', 'exception_type__id' ,'exception_type__description').order_by('id')
    results_list = []

    for result in results:
        new_res = {
            'id': result['id'],
            'table': result['table'],
            'created_at': result['created_at'],
            'exception_ocurred': 1 if result['exception_ocurred'] else 0,
            'exception_id': result['exception_type__id'],
            'exception_description': result['exception_type__description']
        }

        results_list.append(new_res)

    return Response({
        'user': current_user.id,
        'resultados': results_list,
        'message': f'¡Conexión exitosa para {current_user}!'
    }, status=status.HTTP_200_OK)
    
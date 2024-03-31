from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def index(request, id):
    return Response({'message': 'Excepciones de integridad de tablas'})
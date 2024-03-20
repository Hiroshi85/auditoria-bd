from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from rest_framework.response import Response
from rest_framework import status, exceptions
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from .serializers import *

from sqlalchemy import create_engine

# Create your views here.
@api_view(['POST'])
def test_connection(request):
    serializer = DBConnectionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    body = serializer.data

    engine = body['engine']
    name = body['name']
    host = body['host']
    port = body['port']
    username = body['username']
    password = body['password']

    # TODO: Test connection to database
    driver = ""
    if engine == "mysql":
        driver = "mysql+mysqldb"
    elif engine == "sqlserver":
        driver = "mssql+pyodbc"
    else:
        raise exceptions.APIException('Motor de base de datos no soportado', code=400)

    connection_string = f"{driver}://{username}:{password}@{host}:{port}/{name}"

    if engine == "sqlserver":
        connection_string += "?driver=ODBC+Driver+17+for+SQL+Server"

    try:
        db = create_engine(connection_string)
        connection = db.connect()
        connection.close()
    except Exception as e:
        print(e)
        raise exceptions.APIException(e.orig.args[1], code=400)

    # get user
    user = request.userdb
    print(user.email)

    return Response({
        'message': 'Conexión exitosa!'
    }, status=status.HTTP_200_OK)
    
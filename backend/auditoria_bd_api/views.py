from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

from rest_framework.response import Response
from rest_framework import status, exceptions
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from .serializers import *
from .models import *
from cryptography.fernet import Fernet
from decouple import config
from django.utils import timezone

from sqlalchemy import create_engine, MetaData

def get_connection(engine, name, host, port, username, password):
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

    return create_engine(connection_string)

def get_connection_by_id(id, user):
    connection = DatabaseConnection.objects.filter(id=id, user=user).first()
    if not connection:
        raise exceptions.APIException('Conexión no encontrada', code=404)
    
    fernet = Fernet(key=config("SECRET_KEY").encode())
    connection.password = fernet.decrypt(connection.password.encode()).decode()

    return get_connection(connection.engine, connection.name, connection.host, connection.port, connection.username, connection.password)

def try_connection(engine, name, host, port, username, password):
    try:
        db = get_connection(engine, name, host, port, username, password)
        connection = db.connect()
        connection.close()
        return True
    except Exception as e:
        print(e)
        raise exceptions.APIException(e.orig.args[1], code=400)

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

    try_connection(engine, name, host, port, username, password)

    return Response({
        'message': '¡Conexión exitosa!'
    }, status=status.HTTP_200_OK)
    
@api_view(['POST'])
def save_connection(request):
    serializer = DBConnectionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    body = serializer.data

    engine = body['engine']
    name = body['name']
    host = body['host']
    port = body['port']
    username = body['username']
    password = body['password']

    try_connection(engine, name, host, port, username, password)

    fernet = Fernet(key=config("SECRET_KEY").encode())

    # check if connection already exists
    existing_connection = DatabaseConnection.objects.filter(
        engine=engine,
        name=name,
        host=host,
        port=port,
        username=username,
        user=request.userdb
    )

    if existing_connection.exists():
        # Update password asn last used
        existing_connection.update(
            password=fernet.encrypt(password.encode()).decode(),
            last_used=timezone.now()
        )

        return Response({
            'message': '¡Conexión ya guardada!',
            'id': existing_connection.first().id,
        }, status=status.HTTP_200_OK)

    connection = DatabaseConnection(
        engine=engine,
        name=name,
        host=host,
        port=port,
        username=username,
        password=fernet.encrypt(password.encode()).decode(),
        user=request.userdb,
        last_used=timezone.now()
    )

    connection.save()

    return Response({
        'message': '¡Conexión guardada!',
        'id': connection.id,
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_last_connection(request):
    connection = DatabaseConnection.objects.filter(user=request.userdb).order_by('-last_used').first()
    if not connection:
        return Response({}, status=status.HTTP_404_NOT_FOUND)
    
    print(connection.name)
    
    # Decrypt password
    fernet = Fernet(key=config("SECRET_KEY").encode())
    connection.password = fernet.decrypt(connection.password.encode()).decode()

    # Test connection
    try_connection(connection.engine, connection.name, connection.host, connection.port, connection.username, connection.password)

    return Response({
        'engine': connection.engine,
        'name': connection.name,
        'host': connection.host,
        'port': connection.port,
        'username': connection.username,
        'id': connection.id
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_tables(request, id):
    print(id)
    db = get_connection_by_id(id, request.userdb)

    metadata = MetaData()

    metadata.reflect(bind=db)

    tables = metadata.tables.keys()

    return Response({
        'tables': tables
    }, status=status.HTTP_200_OK)
from rest_framework import exceptions
from decouple import config
from ..models import DatabaseConnection
from cryptography.fernet import Fernet

from sqlalchemy import create_engine

api_key = config("SECRET_KEY_VALUE_AAA").encode()

def _get_engine(engine, name, host, port, username, password):
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

    engine = create_engine(connection_string)
    return engine

def get_connection_by_id(id, user):
    connection = DatabaseConnection.objects.filter(id=id, user=user).first()
    if not connection:
        raise exceptions.APIException('Conexión no encontrada', code=404)
    
    fernet = Fernet(key=api_key)
    password = fernet.decrypt(connection.password.encode()).decode()
    
    engine = _get_engine(connection.engine, connection.name, connection.host, connection.port, connection.username, password) 
    return (engine, connection)

def try_connection(engine, name, host, port, username, password):
    try:
        db = _get_engine(engine, name, host, port, username, password)
        connection = db.connect()
        connection.close()
        return True
    except Exception as e:
        print(e)
        raise exceptions.APIException(e.orig.args[1], code=400)
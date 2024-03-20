from sqlalchemy import create_engine, URL
from auditoria_bd_api.configs.gestor_sql_enum import GESTOR_BD

def get_string_gestor(gestor_actual):
    string_gestor = None
    if gestor_actual == GESTOR_BD.MY_SQL:
        string_gestor = "mysql+mysqldb"
    elif gestor_actual == GESTOR_BD.SQL_SERVER:
        string_gestor = "mssql+pyodbc"
    else:
        raise Exception("Gestor de datos no reconocido")
    
    return string_gestor

def get_initial_query_con(gestor_actual):
    query = {}
    if gestor_actual == GESTOR_BD.SQL_SERVER:
        query = {
            "driver": "ODBC Driver 18 for SQL Server"
        }

    return query

def construir_url_conexion(gestor, username, password, host, port, database):
    string_gestor = get_string_gestor(gestor)
    query = get_initial_query_con(gestor)
    url_object =URL.create(
        string_gestor,
        username=username,
        password=password,
        host=host,
        port=port,
        database=database,
        query=query
    )
    return url_object


def get_conexion_sql(url_object):
    engine = create_engine(url_object)
    return engine
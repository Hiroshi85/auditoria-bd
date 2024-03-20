from configs.SQL_connection import construir_url_conexion, get_conexion_sql
from configs.gestor_sql_enum import GESTOR_BD

gestor = GESTOR_BD.MY_SQL

url = construir_url_conexion(gestor, "root", "", "localhost", "3306", "sistema_cepas")
conexion = get_conexion_sql(url)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from auditoria_bd_api.utils import conexiones, table_info, results_operations
from rest_framework import exceptions
from sqlalchemy import and_, or_, func
from ..utils.enums.tipo_excepcion import TipoExcepcion

@api_view(['POST'])
def index(request, id):
    tabla_seleccionada = request.data["table"]
    columnas = request.data["details"]

    db, conn = conexiones.get_connection_by_id(id, request.userdb)
    tabla = table_info.get_reflected_table(db, tabla_seleccionada)

    connection = db.connect()

    result_table = []

    for columna in columnas:
        columns_name = columna.get('column_name', None)
        condition = columna.get('condition', None)
        foreing_table = columna.get('foreing_table', None)
        foreing_column = columna.get('foreing_column', None)

        if condition == "PK": 
            pass
        elif condition == "FK":
            column_result = {"column": columns_name, "foreing_table": foreing_table, "foreing_column" : foreing_column, "results": []}

            foreing_table_meta = table_info.get_reflected_table(db, foreing_table)
            
            primary_key_columns = tabla.primary_key.columns

            # Search for rows with null values in the foreign key column
            columns_table_foreign_key = func.concat(*[tabla.c[column.name] for column in primary_key_columns]).label('primary_key')

            query_null_foreing_key = tabla.select().with_only_columns(columns_table_foreign_key).where(tabla.c[columns_name].is_(None))

            result = connection.execute(query_null_foreing_key)

            null_results = result.mappings().all()

            for row in null_results:
                column_result["results"].append({"primary_key": row["primary_key"], "foreign_key": None, "table_foreign_key": None})


            # Search for rows that do not have a corresponding value in the foreign table
            query_id_foreing_key = foreing_table_meta.select().with_only_columns(foreing_table_meta.c[foreing_column]).distinct()
            
            query_search_foreing_key = tabla.select().with_only_columns(columns_table_foreign_key, tabla.c[columns_name].label("foreign_key")).where(tabla.c[columns_name].isnot(None)).where(tabla.c[columns_name].not_in(query_id_foreing_key))

            result2 = connection.execute(query_search_foreing_key)

            not_found_results = result2.mappings().all()

            for row in not_found_results:
                column_result["results"].append({"primary_key": row["primary_key"], "foreign_key": row["foreign_key"], "table_foreign_key": None})

            result_table.append(column_result)

        else:
            raise exceptions.APIException('Condición no controlada', code=400)
        
    connection.close()

    response_dict = {
        'table': tabla_seleccionada,
        'results': result_table,
    }

    results_operations.save_results(response_dict, conn, TipoExcepcion.TABLA.value, tabla_seleccionada)

    return Response(response_dict)
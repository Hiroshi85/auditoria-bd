from rest_framework.decorators import api_view
from rest_framework.response import Response

from exceptions.utils.enums.tipo_excepcion import TipoExcepcion
from ..utils.secuenciales import *
from ..serializers import *

from auditoria_bd_api.utils.conexiones import get_connection_by_id
from auditoria_bd_api.utils.results_operations import save_results
import datetime

import pandas as pd

@api_view(['POST'])
def integer_sequence_exception(request, id):
    serializer = IntegerSequentialSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data
    table_name = body['table']
    column_name = body['column']
    step = body.get('step', 1)
    sort = body.get('sort', 'no')

    db, conn = get_connection_by_id(id, request.userdb)
    df = get_dataframe_values(db, table_name, column_name, sort)

    if df.empty:
        return get_exception_response(table=table_name,
                                      column=column_name,
                                      database_name=db.engine.url.database, error_result="No se encontraron valores en la columna seleccionada", conn=conn)

    min_value = body.get('min', df.min().values[0])
    max_value = body.get('max', len(df))

    int_sequence = set(range(min_value, max_value + 1, step))
    missing, duplicates, sequence = check_sequence_exception(df, int_sequence)
    return get_exception_response(
        table=table_name,
        column=column_name,
        database_name=db.engine.url.database,
        missing=missing,
        duplicates=duplicates,
        sequence=sequence,
        min_value=min_value,
        max_value=max_value,
        conn=conn)

# region alphanumeric execptions
@api_view(['POST'])
def alphanumeric_sequence_exception(request, id):
    serializer = StringSequencialSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data
    table_name = body['table']
    column_name = body['column']
    step = body.get('step', 1)
    sort = body.get('sort', 'no')
    example = body.get('example')

    db, conn = get_connection_by_id(id, request.userdb)
    df = get_dataframe_values(db, table_name, column_name, sort)

    if df.empty:
        return get_exception_response(table=table_name,
                                      column=column_name,
                                      database_name=db.engine.url.database, error_result="No se encontraron valores en la columna seleccionada.")

    letters, digits = get_letters(example), get_number(example)

    # si no hay letras, no estricto para evitar errores cuando se incrementan los dígitos 
    if letters == '':
        valid_values = df[df.iloc[:, 0].str.match(f'^\d+$', na=False)]
    else:
        valid_values= df[df.iloc[:, 0].str.match(f'^{letters}\d{"{"+str(len(digits))+"}"}+$', na=False)]
    
    if valid_values.empty:
        min_found, max_found = get_min_max_values({}, df)
        return get_exception_response(table=table_name,
                                      column=column_name,
                                      database_name=db.engine.url.database, 
                                      error_result="No se encontraron valores válidos que coincidan con el ejemplo de secuencia.",
                                      min_value=min_found,
                                      max_value=max_found)
    if letters == '':
        min_value = str(valid_values.map(int).min().values[0])
        max_value = str(len(df))
    else:
        min_value = valid_values.min().values[0]
        max_val_str = letters + str(len(df)).zfill(len(digits))
        max_value = max_val_str
    
    min_value, max_value = body.get('min', min_value), body.get('max', max_value)
    
    alphanumeric_sequence = [f'{letters}{str(val).zfill(len(digits))}'
                                 for val in range(int(get_number(min_value)), int(get_number(max_value)) + 1, step)]

    missing, duplicates, sequence = check_sequence_exception(df, alphanumeric_sequence)
    
    return get_exception_response(
        table=table_name,
        column=column_name,
        database_name=db.engine.url.database,
        missing=missing,
        duplicates=duplicates,
        sequence=sequence,
        min_value=min_value,
        max_value=max_value,
        conn = conn)

# region date exceptions
@api_view(['POST'])
def date_sequence_exception(request, id):
    serializer = DateSequencialSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data
    table_name = body['table']
    column_name = body['column']
    sort = body.get('sort', 'no')

    db, conn = get_connection_by_id(id, request.userdb)
    df = get_dataframe_values(db, table_name, column_name, sort)

    if df.empty:
        return get_exception_response(table=table_name,
                                      column=column_name,
                                      database_name=db.engine.url.database, 
                                      error_result="No se encontraron valores en la columna seleccionada", 
                                      conn=conn)

    if type(df.iloc[0, 0]) == pd.Timestamp:
        df = df.apply(lambda x: x.dt.date)

    min_value, max_value = get_min_max_values(body, df)

    freq = body.get('frequency', 'D')

    # cast sequence to date
    date_sequence = pd.date_range(
        start=min_value, end=max_value, freq=freq).strftime('%Y-%m-%d').tolist()

    date_sequence = [datetime.datetime.strptime(
        date, '%Y-%m-%d').date() for date in date_sequence]

    missing, duplicates, sequence = check_sequence_exception(df, date_sequence)

    return get_exception_response(
        table=table_name,
        column=column_name,
        database_name=db.engine.url.database,
        missing=missing,
        duplicates=duplicates,
        sequence=sequence,
        min_value=min_value,
        max_value=max_value,
        conn=conn)

# region exception response
def get_exception_response(
        table,
        column,
        database_name,
        missing=[],
        duplicates=[],
        sequence=[],
        min_value="",
        max_value="",
        error_result="",
        conn = None
):
    if error_result != "":
        return Response({
            'result': 'error',
            'message': error_result,
            'min': min_value,
            'max': max_value,
        }, status=200)

    datetime_analysis = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    response_json = {
        'table': table,
        'column': column,
        'database': database_name,
        'datetime_analysis': datetime_analysis,
        'min': min_value,
        'max': max_value,
    }

    if len(missing) == 0 and len(duplicates) == 0 and len(sequence) == 0:
        exception_was_raised = False
        final_response_json = {
            'result': 'ok',
            **response_json
        }
    else:
        exception_was_raised = True
        final_response_json = {
            'result': 'exception',
            **response_json,
            'num_duplicates': len(duplicates),
            'duplicates': duplicates.values.flatten().tolist(),
            'num_missing': len(missing),
            'missing': missing,
            'num_sequence_errors': len(sequence),
            'sequence_errors': sequence,
        }
    
    save_results(final_response_json, conn, TipoExcepcion.SECUENCIAL, table, exception_was_raised)
    
    return Response(final_response_json, status=200)

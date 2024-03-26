from rest_framework.decorators import api_view
from rest_framework.response import Response
from utils.secuenciales import *
from ..serializers import *

from auditoria_bd_api.utils.conexiones import get_connection_by_id
import datetime

import pandas as pd


@api_view(['GET'])
def integer_sequence_exception(request, id):
    serializer = IntegerSequentialSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data
    table_name = body['table']
    column_name = body['column']
    step = body.get('step', 1)
    sort = body.get('sort', 'no')

    db, _ = get_connection_by_id(id, request.userdb)
    df = get_dataframe_values(db, table_name, column_name, sort)
    min_value, max_value = get_min_max_values(body, df)

    int_sequence = set(range(min_value, max_value + 1, step))
    missing, duplicates, sequence = check_sequence_exception(df, int_sequence)
    return get_exception_response(missing, duplicates, sequence, min_value, max_value)


@api_view(['GET'])
def alphanumeric_sequence_exception(request, id):
    serializer = StringSequencialSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data
    table_name = body['table']
    column_name = body['column']
    step = body.get('step', 1)
    sort = body.get('sort', 'no')
    example = body.get('example')
    is_static = body.get('static', False)

    db, _ = get_connection_by_id(id, request.userdb)
    df = get_dataframe_values(db, table_name, column_name, sort)

    letters, digits = get_letters(example), get_number(example)
    valid_Values = df[df.iloc[:, 0].str.contains(f'{letters}\d+$', na=False)]

    min_value, max_value = get_min_max_values(body, valid_Values)

    if is_static:
        alphanumeric_sequence = [f'{letters}{str(val).zfill(len(digits))}'
                                 for val in range(int(get_number(min_value)), int(get_number(max_value)) + 1, step)]
    else:
        # TODO implementar para secuencias dinámicas en letras y números (itertools)
        pass

    missing, duplicates, sequence = check_sequence_exception(
        df, alphanumeric_sequence)
    return get_exception_response(missing, duplicates, sequence, min_value, max_value)


@api_view(['GET'])
def date_sequence_exception(request, id):
    serializer = DateSequencialSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data
    table_name = body['table']
    column_name = body['column']
    sort = body.get('sort', 'no')

    db, _ = get_connection_by_id(id, request.userdb)
    df = get_dataframe_values(db, table_name, column_name, sort)

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

    return get_exception_response(missing, duplicates, sequence, min_value, max_value)


def get_exception_response(missing, duplicates, sequence, min_value, max_value):
    if len(missing) == 0 and len(duplicates) == 0 and len(sequence) == 0:
        return Response({
            'result': 'ok',
            'min': min_value,
            'max': max_value,
        }, status=200)

    return Response({
        'result': 'exception',
        'min': min_value,
        'max': max_value,
        'num_duplicates': len(duplicates),
        'duplicates': duplicates.values.flatten().tolist(),
        'num_missing': len(missing),
        'missing': missing,
        'num_sequence_errors': len(sequence),
        'sequence_errors': sequence,
    }, status=200)
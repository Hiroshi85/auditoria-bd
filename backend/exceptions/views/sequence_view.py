from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import exceptions
from ..serializers import SequentialSerializer

from auditoria_bd_api.utils.conexiones import get_connection_by_id
from sqlalchemy import MetaData, select
import datetime

import pandas as pd
import itertools
import re


def get_number(string):
    # from ACC00008 exctract 8
    number = re.search(r'\d+', string).group()
    print(f'Number: {number}')
    return number


def get_letters(string):
    # from ACC00008 exctract ACC
    letter = re.search(r'[a-zA-Z]+', string).group()
    print(f'Letter: {letter}')
    return letter


def check_sequence_exception(data, sequence):
    flattened_values = data.values.flatten()

    missing = [value for value in sequence
               if value not in flattened_values]

    duplicates = data[data.duplicated()].drop_duplicates()

    sequence_errors = []

    for index, value in enumerate(sequence):
        if index >= len(flattened_values):
            sequence_errors.append({'expected': value, 'found': None})
            continue

        if value != flattened_values[index]:
            sequence_errors.append(
                {'expected': value, 'found': flattened_values[index]})

    return missing, duplicates, sequence_errors


@api_view(['GET'])
def sequence_exception(request, id):
    serializer = SequentialSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data
    table_name = body['table']
    column_name = body['column']
    step = body.get('step', 1)

    db, _ = get_connection_by_id(id, request.userdb)

    metadata = MetaData()
    metadata.reflect(bind=db)

    try:
        table = metadata.tables[table_name]
        column = table.columns[column_name]
    except KeyError:
        return Response({
            'error': f'Table or column not found'
        }, status=404)

    # select column from table
    cnn = db.connect()
    stmt = select(column).where(column.isnot(None))

    if body['sort'] == 'yes':
        stmt = stmt.order_by(column.description)
    else:
        stmt = stmt.order_by(table.primary_key.columns.values()[0].description)

    result = cnn.execute(stmt)
    cnn.close()

    values = [row[0] for row in result.fetchall()]
    df = pd.DataFrame(values)

    # cast data to date if column is datetime
    if column.type.python_type == datetime.datetime:
        df = df.applymap(lambda x: x.date())

    min_value = body.get('min', df.min().values[0])
    max_value = body.get('max', df.max().values[0])

    missing, duplicates, sequence = [], [], []
    try:
        if column.type.python_type == int:
            int_sequence = set(range(min_value, max_value + 1, step))
            missing, duplicates, sequence = check_sequence_exception(
                df, int_sequence)
        else:
            if column.type.python_type == str:
                example = body.get('example')
                is_static = body.get('static', False)
                # split example in letters and digits
                letters, digits = get_letters(example), get_number(example)
                
                # divide df in valid values and invalid values using the example
                valid_Values = df[df.iloc[:, 0].str.contains(f'{letters}\d+$', na=False)]

                min_value = body.get('min', valid_Values.min().values[0])
                max_value = body.get('max', valid_Values.max().values[0])
                
                #invalid_values = df.loc[~df.index.isin(valid_Values.index)]
               
                if is_static:
                    # ACC00001 -> ACC00002 -> ACC00003 -> ACC00004 ... -> ACC0008 (MAX_VALUE)
                    alphanumeric_sequence = [f'{letters}{str(val).zfill(len(digits))}' 
                                             for val in range(int(get_number(min_value)), int(get_number(max_value)) + 1, step)]
                else:
                    # TODO implementar para secuencias dinámicas en letras y números (itertools)
                    pass
            
                missing, duplicates, sequence = check_sequence_exception(df, alphanumeric_sequence)

            elif column.type.python_type == datetime.date or column.type.python_type == datetime.datetime:
                freq = body.get('frequency', 'D')
                # cast sequence to date
                date_sequence = pd.date_range(
                    start=min_value, end=max_value, freq=freq).strftime('%Y-%m-%d').tolist()
                date_sequence = [datetime.datetime.strptime(
                    date, '%Y-%m-%d').date() for date in date_sequence]

                missing, duplicates, sequence = check_sequence_exception(
                    df, date_sequence)
            else:
                raise exceptions.APIException(
                    f'No se puede evaluar la secuencia en un campo de tipo {column.type}')
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=400)

    # TODO Save results in database

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

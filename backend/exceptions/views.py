from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import exceptions
from .serializers import *

from auditoria_bd_api.views import get_connection_by_id
from sqlalchemy import MetaData, select, text
import datetime
import pandas as pd

def check_sequence_exception(data, sequence):
    flattened_values = data.values.flatten()

    missing = [value for value in sequence 
               if value not in flattened_values]
    
    duplicates = data[data.duplicated()].drop_duplicates()
    
    sequence = []
    for index, value in enumerate(sequence): 
        if index >= len(flattened_values):
            sequence.append({'expected': value, 'found': None})
            continue
        
        if value != flattened_values[index]:
            sequence.append({'expected': value, 'found': flattened_values[index]})

    return missing, duplicates, sequence

@api_view(['GET'])
def sequence_exception(request, id):
    serializer = SequentialSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    body = serializer.data
    table_name = body['table']
    column_name = body['column']

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
    
    if column.type.python_type == datetime.datetime:
        df = df.applymap(lambda x: x.date())

    min_value = body['min'] if 'min' in body else df.min().values[0]
    max_value = body['max'] if 'max' in body else df.max().values[0]    

    print(f'Min: {min_value}, Max: {max_value}')
    
    missing, duplicates, sequence = [], [], []
    
    print(column.type.python_type)
    
    if column.type.python_type == int:
        int_sequence = set(range(min_value, max_value + 1))
        missing, duplicates, sequence = check_sequence_exception(df, int_sequence)
    else:
        if column.type.python_type == str:
        # TODO check the sequence for alphanumeric values
            pass
        elif column.type.python_type == datetime.date or column.type.python_type == datetime.datetime: 
            # freq = body['frequency'] if 'frequency' in body else 'D'
            # cast sequence to date
            date_sequence = pd.date_range(start=min_value, end=max_value, freq='D').strftime('%Y-%m-%d').tolist()
            date_sequence = [datetime.datetime.strptime(date, '%Y-%m-%d').date() for date in date_sequence]

            missing, duplicates, sequence = check_sequence_exception(df, date_sequence)
        else:
            raise exceptions.APIException(f'No se puede evaluar la secuencia en un campo de tipo {column.type}')
            
    #TODO Save results in database

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
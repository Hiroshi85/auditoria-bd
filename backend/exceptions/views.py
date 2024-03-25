from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *

from auditoria_bd_api.views import get_connection_by_id
from sqlalchemy import MetaData, select, text

import pandas as pd

def check_integer_sequence(dataframe, min, max):
    lista_auxilitar = set(range(min, max))
    flattened_values = dataframe.values.flatten()
    # print(flattened_values)
    missing = [value for value in lista_auxilitar 
               if value not in flattened_values]
    
    duplicates = dataframe[dataframe.duplicated()].drop_duplicates()
    print(flattened_values[:10])
    
    sequence = []
    print(flattened_values[:10], list(range(min, max))[:10])
    for index, value in enumerate(lista_auxilitar): 
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
    stmt = select(column).where(column.isnot(None)).where(column <= 394)

    if body['sort'] == 'yes': 
        stmt = stmt.order_by(column.description)

    # result = cnn.execute(stmt)                 
    values = [] 
    for row in cnn.execute(stmt):
        values.append(row[0])
    cnn.close()
   
    # values = [row[0] for row in result.fetchall()]
    print(f'Values: {values[:10]}')
    df = pd.DataFrame(values)


    min_value = body['min'] if 'min' in body else df.min().values[0]
    max_value = body['max'] if 'max' in body else df.max().values[0]    

    if column.type.python_type == int:
        missing, duplicates, sequence = check_integer_sequence(df, min_value, max_value + 1)
    else:
        if column.type.python_type == str:
        # TODO check the sequence for other types varchar, dates, etc
            pass
        pass
 

    
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
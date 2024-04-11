
from rest_framework import exceptions
from sqlalchemy import MetaData, select
import pandas as pd
# import itertools
import re

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


def get_dataframe_values(db, table_name, column_name, sort):
    metadata = MetaData()
    metadata.reflect(bind=db, only=[table_name])

    try:
        table = metadata.tables[table_name]
        column = table.columns[column_name]
    except KeyError:
        raise exceptions.APIException('Table or column not found', code=404)

    with db.connect() as cnn:
        stmt = select(column).where(column.isnot(None))

        # validar si no tiene pk ordenar por la misma columna
        pks = table.primary_key.columns.values()

        if sort == 'asc' or not pks:
            stmt = stmt.order_by(column.description)
        else:
            stmt = stmt.order_by(pks[0].description)

        result = cnn.execute(stmt)
        values = result.fetchall()
    
    df = pd.DataFrame(values)
   
    return df


def get_number(string):
    number = re.search(r'\d+', string)
    number = number.group() if number else '0'
    return number


def get_letters(string):
    letter = re.search(r'[^\d]+', string)
    letter = letter.group() if letter else ''
    return letter

def get_min_max_values(req_body, df):
    min_value = req_body.get('min', df.min().values[0])
    max_value = req_body.get('max', df.max().values[0])
    return min_value, max_value
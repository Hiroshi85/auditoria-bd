from sqlalchemy import MetaData

def get_table(db_engine):
    metadata = MetaData()
    metadata.reflect(bind=db_engine)
    tables = metadata.tables.keys()

    return tables

def get_table_detail(db_engine, table_name):
    metadata = MetaData()
    metadata.reflect(bind=db_engine)
    table = metadata.tables[table_name]
    
    tableDetails = []

    for column in table.columns:
        tableDetails.append({
            'name': column.name,
            'type': str(column.type),
            'nullable': column.nullable,
            'unique': column.unique,
            'default': column.default,
            'primary_key': column.primary_key,
            'foreign_key': [{'table':foreign.column.table.name,'column': foreign.column.name } for foreign in column.foreign_keys],
            'autoincrement': column.autoincrement,
            'constraints': column.constraints,
            'key': 'PK' if column.primary_key else 'FK' if column.foreign_keys else ''
        })

    return tableDetails
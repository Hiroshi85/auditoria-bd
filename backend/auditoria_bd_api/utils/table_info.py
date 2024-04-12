from sqlalchemy import MetaData, Table

def get_reflected_table(db_engine, table_name):
    metadata = MetaData()
    tabla_reflejada = Table(table_name, metadata, autoload_with=db_engine)

    return tabla_reflejada

def get_table_names(db_engine):
    metadata = MetaData()
    metadata.reflect(bind=db_engine)
    tables = metadata.tables.keys()

    return tables

def get_table_detail(db_engine, table_name, basic=False):
    metadata = MetaData()
    metadata.reflect(bind=db_engine, only=[table_name])
    table = metadata.tables[table_name]
    
    tableDetails = []

    for column in table.columns:
        try:
            python_type = column.type.python_type.__name__
        except:
            python_type = 'unknown'
        
        if basic:
            tableDetails.append({
                'name': column.name,
                'type': str(column.type),
                'key': 'PK' if column.primary_key else 'FK' if column.foreign_keys else ''
            })
            continue

        tableDetails.append({
            'name': column.name,
            'type': str(column.type),
            'python_type':  python_type,
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
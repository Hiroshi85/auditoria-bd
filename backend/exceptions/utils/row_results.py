from datetime import datetime, date, time
from decimal import Decimal
import pandas as pd

def rows_to_new_dict(result_db):
    resultados = []
    for row in result_db:
        new_row = {**row._mapping}
        resultados.append(new_row)

    return resultados

def sanitize_objects_in_rows(results):
    results_df = pd.DataFrame.from_dict(results)
    column_types = results_df.dtypes

    for column, dtype in column_types.items():
        if dtype == 'timedelta64[ns]':
            results_df[column] = results_df[column].fillna(pd.Timedelta(seconds = 0)).apply(lambda x: str(x))
        elif dtype == 'datetime64[ns]':
            results_df[column] = results_df[column].apply(lambda x: x.strftime("%Y-%m-%d %H:%M:%S") if pd.notnull(x) else "")
        elif dtype == 'time':
            results_df[column] = results_df[column].apply(lambda x: x.strftime("%H:%M:%S") if pd.notnull(x) else "")
        elif dtype == 'date':
            results_df[column] = results_df[column].apply(lambda x: x.strftime("%Y-%m-%d") if pd.notnull(x) else "")
        elif dtype == 'float64':
            results_df[column] = results_df[column].apply(lambda x: float(x) if pd.notnull(x) else "")

    print("After sanitize: ", results_df)
    return results_df.to_dict('records')
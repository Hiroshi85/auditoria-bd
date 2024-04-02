from ..models import Result

def save_results(dict_string, connection_id, exception_type, table):
    result = Result(
        table=table,
        results= dict_string,
        connection=connection_id,
        exception_type=exception_type
    )
    result.save()
    return result
    
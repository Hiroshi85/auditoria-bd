from exceptions.models import ExceptionType
from ..models import Result

def save_results(dict_string, connection_id, exception_type_id, table):
    exception_type_instance = ExceptionType.objects.get(id=exception_type_id)
    result = Result(
        table=table,
        results= dict_string,
        connection=connection_id,
        exception_type=exception_type_instance
    )
    result.save()
    return result
    
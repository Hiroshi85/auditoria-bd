from exceptions.models import ExceptionType
from ..models import Result

def save_results(response_dict_str, connection_id, exception_type_enum, table, exception_ocurred):
    exception_type_value = ExceptionType.objects.get(id=exception_type_enum.value)
    result = Result(
        table=table,
        results= response_dict_str,
        connection=connection_id,
        exception_type=exception_type_value,
        exception_ocurred=exception_ocurred
    )
    result.save()
    return result
    
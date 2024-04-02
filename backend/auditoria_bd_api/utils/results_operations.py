import json
from exceptions.models import ExceptionType
from ..models import Result

def save_results(response_dict, connection_id, exception_type_enum, table, exception_ocurred):
    result_json = json.dumps(response_dict, default=str)
    exception_type_value = ExceptionType.objects.get(id=exception_type_enum.value)
    result = Result(
        table=table,
        results= result_json,
        connection=connection_id,
        exception_type=exception_type_value,
        exception_ocurred=exception_ocurred
    )
    result.save()
    return result
    
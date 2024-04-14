from exceptions.models import ExceptionType
from ..models import Result
import json 
def save_results(response_dict_str, connection_id, exception_type_enum, table, exception_ocurred):
    exception_type_value = ExceptionType.objects.get(id=exception_type_enum.value)
    try:
        result = Result(
            table=table,
            results= json.dumps(response_dict_str, default=str),
            connection=connection_id,
            exception_type=exception_type_value,
            exception_ocurred=exception_ocurred
        )
        result.save()
    except Exception as e:
        print(f"Error al guardar resultado\nDetalle: {e}")
    
    return result
    
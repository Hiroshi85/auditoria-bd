from exceptions.models import ExceptionType
from ..models import Result
from exceptions.utils.enums.tipo_excepcion import TipoExcepcion
from ..pagination.exception_results import ExceptionResultPagination
import json


def save_results(response_dict_str, connection_id, exception_type_enum, table, exception_ocurred):
    exception_type_value = ExceptionType.objects.get(
        id=exception_type_enum.value)
    try:
        result = Result(
            table=table,
            results=json.dumps(response_dict_str, default=str),
            connection=connection_id,
            exception_type=exception_type_value,
            exception_ocurred=exception_ocurred
        )
        result.save()
    except Exception as e:
        print(f"Error al guardar resultado\nDetalle: {e}")

    return result


def paginate_results(paginator_class, request, data):
    paginator = paginator_class
    page = paginator.paginate_queryset(request=request, queryset=data)
    if page is not None:
        return paginator.get_paginated_response(page)
    return data


def get_paginated_dict_by_type(request, exception_type, exception_dict):
    paginated_dict = {}
    if (exception_type == TipoExcepcion.PERSONALIZADO.value):
        # data to paginate
        rows = exception_dict.pop('rows')
        
        #try to filter 
        rows = filterDict(request, rows, 'search')

        paginated_dict = {
            'rows': paginate_results(paginator_class=ExceptionResultPagination(), request=request, data=rows)
        }
    elif (exception_type == TipoExcepcion.SECUENCIAL.value):
        duplicates = exception_dict.pop('duplicates')
        missing = exception_dict.pop('missing')
        sequence = exception_dict.pop('sequence_errors')

        # try to filter 
        duplicates = filterDict(request, duplicates, 'search_duplicates', strict_query='strict_duplicates')
        missing = filterDict(request, missing,  'search_missing', strict_query='strict_missing')
        sequence = filterDict(request, sequence, 'search_sequence', strict_query='strict_sequence')

        paginated_dict = {
            'duplicates': paginate_results(
                paginator_class=ExceptionResultPagination(page_query_param='duplicates_page', 
                                                          page_size_query_param='duplicates_page_size'), 
                                                          request=request, data=duplicates),
            'missing': paginate_results(
                paginator_class=ExceptionResultPagination(page_query_param='missing_page', 
                                                          page_size_query_param='missing_page_size'), 
                                                          request=request, data=missing),
            'sequence_errors': paginate_results(
                paginator_class=ExceptionResultPagination(page_query_param='sequence_page', 
                                                          page_size_query_param='sequence_page_size'), 
                                                          request=request, data=sequence),
                                                          
        }

    return {**exception_dict, **paginated_dict}

def filterDict (request, data, query_param, strict_query = 'strict'):
    if len(data) == 0:
        return data
    
    search_param = request.GET.get(query_param, '')
    strict = request.GET.get(strict_query, 'false').lower() == 'true'

    if search_param:
        if isinstance(data[0], dict):
            print("filtrando diccionario")
            if strict:
                data = [row for row in data if any(str(search_param.lower()) == str(value).lower() for value in row.values())]
            else:
                data = [row for row in data if any(search_param.lower() in str(value).lower() for value in row.values())]
        else: 
            if strict:
                data = [row for row in data if str(search_param.lower()) == str(row).lower()]
            else:
                data = [row for row in data if search_param.lower() in str(row).lower()]
    return data

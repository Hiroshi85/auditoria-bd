# custom pagination to large data with custom _exceptions
#
#    response_dict = {
#        'result': 'ok',
#        'table': table,
#        'name': task_name,
#        'query': str(query),
#        'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
#        'num_rows': len(data),
#        'data': resultados
#    }
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
import datetime


class CustomPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 500
    page_query_param = 'p'

    def get_paginated_response(self, data):
        return Response({
            'result': 'ok',
            'table': 'table',
            'name': 'task_name',
            'query': 'str(query)',
            'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'num_rows': len(data),
            'data': data,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
        })

def paginate_results(paginator_class, request, data):
    paginator = paginator_class
    page = paginator.paginate_queryset(request=request, queryset=data)
    if page is not None:
        return paginator.get_paginated_response(page)
    return data
def formatResultResponse(results):
    headers = list(results[0].keys()) if results else []
    data = [list(row.values()) for row in results]
    return {
        'headers': headers,
        'data': data
    }
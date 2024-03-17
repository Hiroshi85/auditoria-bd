def create_response(data=None, error=None):
    response = {}
    if error is not None:
        response["status"] = "error"
        response["error"] = error
        return response
    
    response["status"] = "success"
    response["data"] = data
    return response 


def create_error_response(message, code=None):
    error = {}
    if code is not None:
        error["code"] = code
    error["message"] = message
    return create_response(error=error)
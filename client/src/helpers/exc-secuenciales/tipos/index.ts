export function getExceptionType(python_type : string){
    const exc_types: {[key: string]: string} = {
        'int': 'numeric',
        'str': 'alphanumeric',
        'date': 'date',
        'datetime': 'date',
    }
    return exc_types[python_type] || "";
}
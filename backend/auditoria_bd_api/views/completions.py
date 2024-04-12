from rest_framework.decorators import api_view
from rest_framework.response import Response
from decouple import config
from openai import OpenAI
import json
from django.http import StreamingHttpResponse
from ..utils.conexiones import get_connection_by_id, try_connection
from ..utils import table_info

client = OpenAI(
    api_key=config('OPEN_AI_KEY'),
)

@api_view(['POST'])
def get_query_by_prompt(request, id):
    query = request.data['query']
    table = request.data['table']

    db, connection = get_connection_by_id(id, request.userdb)
    tables = table_info.get_table_names(db)

    tables_use = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Devuelve las tablas que deben usarse en la consulta"},
            {"role": "system", "content": "Solo response en json"},
            {"role": "system", "content": 'No des otra respuesta que no sea json. Tiene que comenzar con "{" y terminar con "}", solo debe tener un campo llamado "result" con un array de tablas. Ejemplo: {"result": ["tabla1", "tabla2", "tabla3"]}'},
            {"role": "system", "content": 'Ejemplo de respuesta json: {"result" :["tabla1", "tabla2", "tabla3"]}'},
            {"role": "system", "content": "si no hay tabla para usar o el prompt no es lo suficientemente claro sobre que tablas usar, responde con '.'"},
            {"role": "system", "content": "Tablas de la base de datos: " + ', '.join(tables)},
            {"role": "user", "content": query},
        ]
    )

    response = tables_use.choices[0].message.content

    if response == '.':
        response = {'result': []}
    else: 
        try: 
            response = json.loads(response)
        except:
            response = {'result': []}
    
    print(tables_use)
    print(tables_use.choices[0].message.content)
    
    

    tables_details = []

    for table in response['result']:
        table_detail = table_info.get_table_detail(db, table, basic=True)
        tables_details.append({
            'table': table,
            'columns': table_detail
        })

    if table not in response['result']:
        table_detail = table_info.get_table_detail(db, table, basic=True)
        tables_details.append({
            'table': table,
            'columns': table_detail
        })

    query_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Genera la consulta MySQl a partir de las tablas seleccionadas. Solo devuelve la consulta. No añadas comentarios de tu parte. Comienza con 'SELECT' y termina con ';'"},
            {"role": "system", "content": "Motor base de datos:" + connection.engine},
            {"role": "system", "content": json.dumps(tables_details)},
            {"role": "system", "content": "No es necesario que uses todas las tablas"},
            {"role": "user", "content": query},
        ]
    )

    print(query_response.choices[0].message.content)

    return Response({
        'message': query_response.choices[0].message.content
    })



    # def event_stream():
    #     for chunk in client.completions.create(
    #         model="gpt-3.5-turbo-instruct",
    #         prompt=f"DatabaseEngine: mysql. Get query string for this prompt: {query}",
    #         stream=True
    #     ):
    #         print(chunk.choices[0].text)
    #         text = chunk.choices[0].text
    #         yield f'data: {text}\\n\\n'

    # response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
    # response['X-Accel-Buffering'] = 'no'  # Disable buffering in nginx
    # response['Cache-Control'] = 'no-cache'  # Ensure clients don't cache the data
    # return response
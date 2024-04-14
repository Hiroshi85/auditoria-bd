from datetime import datetime, date, time

def rows_to_new_dict(result_db):
    resultados = []
    for row in result_db:
        new_row = {**row._mapping}
        resultados.append(new_row)

    return resultados

def datetime_value_to_str_in_results(results):
    first_result = results[0]
    for val in first_result.keys():
        valor = first_result[val]

        if(type(valor) is date):
            for res in results:
                res[val] = valor.strftime("%Y-%m-%d")
                
        elif(type(valor) is time):
            for res in results:
                res[val] = valor.strftime("%H:%M:%S")
                
        elif(type(valor) is datetime):
            for res in results:
                res[val] = valor.strftime("%Y-%m-%d %H:%M:%S")
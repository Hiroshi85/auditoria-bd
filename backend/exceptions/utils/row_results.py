def rows_to_new_dict(result_db):
    resultados = []
    for row in result_db:
        new_row = {**row._mapping}
        resultados.append(new_row)

    return resultados
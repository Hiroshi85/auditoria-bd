FROM python:3.12

RUN apt-get update && apt-get install -y default-libmysqlclient-dev

# Copia los archivos del proyecto
COPY . .

# Instala las dependencias del proyecto
RUN pip install -r requirements.txt

# Expone el puerto 8000
EXPOSE 8000

# Comando para configurar las variables de entorno y ejecutar las migraciones y luego el servidor Django
CMD ["sh", "-c", "env > .env && python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

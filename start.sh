#!/bin/bash

# Activar el entorno virtual de Python (venv)
source ./backend/venv/bin/activate

# Función para manejar la terminación de procesos
cleanup() {
    echo "Señal de terminación recibida. Deteniendo los procesos..."
    # Detener el servidor de Next.js si está corriendo en el puerto 3000
    echo "Deteniendo el servidor de Next.js..."
    fuser -k -n tcp 3000

    # Detener el servidor de Django si está corriendo en el puerto 8000
    echo "Deteniendo el servidor de Django..."
    fuser -k -n tcp 8000

    exit 1
}

# Capturar señales de terminación
trap 'cleanup' SIGINT SIGTERM

# Iniciar el servidor de desarrollo de Next.js
echo "Iniciando el servidor de desarrollo de Next.js..."
cd client/
npm run dev &

# Esperar un momento para asegurarse de que el servidor de Next.js se haya iniciado correctamente
sleep 5

# Cambiar al directorio del proyecto Django
cd ../backend/

# Iniciar el servidor de desarrollo de Django REST Framework dentro del entorno virtual
echo "Iniciando el servidor de desarrollo de Django REST Framework..."
python manage.py migrate
python manage.py runserver &

# Esperar a que alguno de los servidores termine
wait -n

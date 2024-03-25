#!/bin/bash

# Verificar si el entorno virtual ya está creado
if [ ! -d "backend/venv" ]; then
    # Si no existe, crear el entorno virtual de Python (venv)
    echo "Creando entorno virtual de Python..."
    python3.11 -m venv backend/venv
fi

# Activar el entorno virtual de Python (venv)
echo "Activando el entorno virtual de Python..."
source backend/venv/bin/activate

# Instalar las dependencias de Python
echo "Instalando o actualizando dependencias de Python..."
pip install -r backend/requirements.txt

# Instalar Node.js dependencies
echo "Instalando dependencias de Node.js..."
cd client/
npm install

# Volver al directorio raíz del proyecto
cd ..

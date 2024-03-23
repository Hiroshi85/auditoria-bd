#!/bin/bash

# Detener el servidor de Next.js si está corriendo en el puerto 3000
echo "Deteniendo el servidor de Next.js..."
fuser -k -n tcp 3000

# Detener el servidor de Django si está corriendo en el puerto 8000
echo "Deteniendo el servidor de Django..."
fuser -k -n tcp 8000

### Crear un Entorno Virtual en Python

#### **Instalar `virtualenv` (si no está instalado)**:
   
Abre una terminal y ejecuta el siguiente comando para instalar `virtualenv` utilizando pip:
```
pip install virtualenv
```

#### **Crear el Entorno Virtual**:

Ejecuta el siguiente comando para crear un nuevo entorno virtual. Puedes elegir el nombre que desees para el entorno virtual (en este caso, lo llamaremos `venv`):
```
virtualenv venv
```

#### **Activar el Entorno Virtual**:

Para activar el entorno virtual en Linux/Mac, ejecuta:
```
source venv/bin/activate
```

Para activar el entorno virtual en Windows, ejecuta:
```
venv\Scripts\activate
```

Notarás que el prompt de tu terminal cambiará, indicando que el entorno virtual está activo.

### Instalar Paquetes desde `requirements.txt`

#### **Instalar los Paquetes del Archivo `requirements.txt`**:

Una vez que el entorno virtual está activado, puedes instalar los paquetes del archivo `requirements.txt` utilizando el comando `pip`:
```
pip install -r requirements.txt
```


Esto instalará todos los paquetes listados en el archivo `requirements.txt` en el entorno virtual activo.

#### **Desactivar el Entorno Virtual**:

Cuando hayas terminado de trabajar en tu proyecto y desees salir del entorno virtual, puedes desactivarlo ejecutando:
```
deactivate
```
**Ejecutar el Servidor de Desarrollo**:

Una vez que el entorno virtual esté activado y te encuentres en el directorio del proyecto, ejecuta el siguiente comando para iniciar el servidor de desarrollo de Django:
```
python manage.py runserver
```


**Acceder al Proyecto en tu Navegador**:

Abre tu navegador web e ingresa la siguiente URL en la barra de direcciones:
http://127.0.0.1:8000/

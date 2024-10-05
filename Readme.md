# MatchYourStyle

## Instalar dependencias

Primero asegurar que tienen la version de Python 3.10

```shell
python3 --version
```

Despues crear el entorno virtual y activarlo

```shell
python3 -m venv env
source env/bin/activate
```

Y terminar configurando el enterno virtual con el archivo requirements.txt

```shell
pip install -r "requirements.txt"
```

## Django

### Comandos esenciales
Los comandos esenciales en django, se corren desde el archivo manage.py que he aprendido son:

```shell
./manage.py runserver
./manage.py createsuperuser
./manage.py makemigrations
./manage.py migrate
./manage.py loaddata
```

- El primero se ocupa para correr el servidor, como un rails s.
- El segundo se ocupa para crear un "super usuario", el cual puede acceder a admin del backend, para modificar la bd desde el servidor mismo
- El resto se ocupa para migraciones y cargar data de un .json a la base de datos, sirve porque en el momento en que hagamos deploy hay que poblar la bd desde el mismo servidor, com un seed en rails.

### Carpeta Backend

Esta carpeta no es el backend como si, ya que aqui no se configuran las solicitudes GET, POST, etc. Esta carpeta es la carpeta raiz del proyecto y es donde se configura el archivo. En teoría ya está todo conectado y no habría que tocarla más hasta que queramos deployarlo.

### Carpeta mys

#### Modelos

Aqui si es el backend y donde configuramos nuestros modelos en el archivo models.py, tal como este:

```python
class User(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=50)
    email = models.EmailField(max_length=254)
    phone = models.CharField(max_length=50)
    address = models.CharField(max_length=50)

    def __str__(self):
        return self.username
```

Después de editar este archivo hay que crear la migración, estando en la carpeta de mas afuera, ocupando el comando:

```shell
./manage.py makemigrations
```

Para despues migrar estas a la base de datos con el comando:
```shell
./manage.py migrate
```

##### Loaddata
El ultimo comando aqui importante es el loaddata, que hay en el archivo users.json de momento. Este archivo esta en fixtures, y para subir los datos es :
```shell
./manage.py loaddata "users.json"
```
#### Vistas
En este archivo es donde vamos a configurar las vistas, las cuales vamos a configurar para ver que le retornamos a la llamada, tal como:

```python
class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
```

Aqui estamos pidiendole todos los usuarios ocupando el serializer, el cual se ocupa para retornar los datos con formato json.

Para mi esta es la gracia de django, que podemos ocupar la logica de python para filtrar datos y obtenerlos con distintas llamadas.

#### Urls
Para poder ocupar estas vistas en el frontend hay que asignarle una url, la cual se hace en el archivo urls.py tal como:

```python
    path('users/', views.UserListCreate.as_view(), name='user-list-create'),
```
Hay que destacar que todos los llamados a la api hay que agregarle el api en frente para poder hacer llamados, es decir, para llamar a esta url habría que hacer un llada la url: 

```js
fetch('http://localhost:8000/api/users/')
```

## React

Para ocupar react es igual que apps, solo que la llamada a la api esta en el puerto 8000 en vez de en el puerto 3000.

Tambien para partir el frontend de la app hay que estar en la carpeta frontend y correr npm start en vez de npm run dev
 ```shell
 cd frontend
 npm start
 ```

 Y eso creo que es todo :)


# POC Integracion de Clientes XYZ


Autor: Alex Giovanny Pozo Pachar
POC de simulación en envio de clientes desde la empresa XYZ hacia las empresas 123 y ABC, usando una capa de integracion basada en Apache Camel.


## Objetivo

La empresa XYZ ya tiene clientes perfilados en su CRM. Esta POC recibe clientes en formato JSON y los enruta segun el canal de compra preferido:

- 'DIGITAL' -> Empresa 123
- 'PRESENCIAL' -> Empresa ABC

## Framework y patron usados

- Framework de integracion: Apache Camel sobre Spring Boot
- Patron de integracion: Content-Based Router
- Formato de intercambio: JSON
- Protocolo: HTTP REST

## Componentes del proyecto

Se Agregan 4 contenedores para la simulacion
1. `empresa123-service` en el puerto `8081`
2. `empresaabc-service` en el puerto `8087`
3. `integration-service` en el puerto `8089`
4. `frontend-clientes` en el puerto `5173` local, servido internamente por Nginx en el puerto `80`

## Patron Content-Based Router

El patron Content-Based Router revisa el contenido del mensaje y decide a que endpoint enviarlo. En esta POC, la decision se toma con el campo `perfilCompra`.

## Ventajas

- XYZ no depende directamente de los sistemas internos de Empresa 123 ni Empresa ABC.
- Se puede cambiar el destino sin modificar el CRM.
- Se pueden agregar nuevos perfiles y nuevas empresas al consorcio.
- El intercambio usa JSON, formato acordado entre las empresas.


poc-integracion-clientes/
├── pom.xml
├── integration-service/
│   └── Servicio de integracion Apache Camel en puerto 8089
├── empresa123-service/
│   └── API simulada de Empresa 123 en puerto 8081
├── empresaabc-service/
│   └── API simulada de Empresa ABC en puerto 8087
├── frontend-clientes/
│   └── Captura de Datos para probar la API de envio despues de las validaciones  en el puerto 5173


## Requisitos

Si se ejecuta independiente
- Java 17 o superior
- Maven 3.9 o superior
- Postman par probar todas las APIs

o para ejecutar con docker-compose
- Docker desktop

## Como compilar

Desde la raiz del proyecto:

mvn clean package
mvn clean install



## Como ejecutar

Opcion 1
Para crear automaticamente todo
docker compose up



Opcion 2: ejecutar cada servicio en una terminal distinta.

Terminal 1:    java -jar empresa123-service/target/empresa123-service-1.0.0.jar
Terminal 2:    java -jar empresaabc-service/target/empresaabc-service-1.0.0.jar
Terminal 3:    java -jar integration-service/target/integration-service-1.0.0.jar


## Como probar

Con los servicios levantados, ejecutar:
Postman o aplicacion Frontend


## Endpoints

| Servicio | URL | Descripcion |
| Integracion XYZ | `POST http://localhost:8089/api/clientes/enviar` | Recibe el cliente desde XYZ y decide el destino |
| Empresa 123 | `POST http://localhost:8081/api/clientes` | Recibe clientes digitales |
| Empresa ABC | `POST http://localhost:8087/api/clientes` | Recibe clientes presenciales |

## Regla de negocio

La regla esta implementada en:

integration-service/src/main/java/com/xyz/integration/routes/ClienteRouterRoute.java


La ruta Camel evalua el campo `perfilCompra` con JSONPath.


$.perfilCompra == 'DIGITAL'     -> Empresa 123
$.perfilCompra == 'PRESENCIAL' -> Empresa ABC


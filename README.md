# POC Integracion de Clientes XYZ

Prueba de concepto para simular el envio de clientes desde la empresa XYZ hacia las empresas 123 y ABC, usando una capa de integracion basada en Apache Camel.

## Objetivo

La empresa XYZ ya tiene clientes perfilados en su CRM. Esta POC recibe clientes en formato JSON y los enruta segun el canal de compra preferido:

- `DIGITAL` -> Empresa 123
- `PRESENCIAL` -> Empresa ABC

## Framework y patron usados

- Framework de integracion: Apache Camel sobre Spring Boot
- Patron de integracion: Content-Based Router
- Formato de intercambio: JSON
- Protocolo: HTTP REST

## Componentes del proyecto

```text
poc-integracion-clientes/
├── pom.xml
├── integration-service/
│   └── Servicio de integracion Apache Camel en puerto 8089
├── empresa123-service/
│   └── API simulada de Empresa 123 en puerto 8081
├── empresaabc-service/
│   └── API simulada de Empresa ABC en puerto 8082
├── scripts/
│   ├── run-all.sh
│   └── test-requests.sh
└── docs/
    ├── arquitectura.md
    └── ejemplos-json.md
```

## Requisitos

- Java 17 o superior
- Maven 3.9 o superior
- curl para ejecutar las pruebas desde consola

## Como compilar

Desde la raiz del proyecto:

```bash
mvn clean package
```

mvn clean install


## Como ejecutar

Opcion 1: ejecutar cada servicio en una terminal distinta.

Terminal 1:

```bash
java -jar empresa123-service/target/empresa123-service-1.0.0.jar
```

Terminal 2:

```bash
java -jar empresaabc-service/target/empresaabc-service-1.0.0.jar
```

Terminal 3:

```bash
java -jar integration-service/target/integration-service-1.0.0.jar
```

Opcion 2: ejecutar los tres servicios con el script:

```bash
chmod +x scripts/run-all.sh scripts/test-requests.sh
./scripts/run-all.sh
```

El script crea archivos de log en la carpeta `logs/`.

## Como probar

Con los servicios levantados, ejecutar:

```bash
./scripts/test-requests.sh
```

Tambien se puede probar manualmente.

### Cliente digital

```bash
curl -X POST http://localhost:8089/api/clientes/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": "C001",
    "nombre": "Maria Lopez",
    "email": "maria@correo.com",
    "telefono": "0999999999",
    "ciudad": "Quito",
    "perfilCompra": "DIGITAL"
  }'
```

Resultado esperado: el cliente llega a Empresa 123.

### Cliente presencial

```bash
curl -X POST http://localhost:8089/api/clientes/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": "C002",
    "nombre": "Carlos Perez",
    "email": "carlos@correo.com",
    "telefono": "0988888888",
    "ciudad": "Guayaquil",
    "perfilCompra": "PRESENCIAL"
  }'
```

Resultado esperado: el cliente llega a Empresa ABC.

### Cliente con perfil invalido

```bash
curl -X POST http://localhost:8080/api/clientes/enviar \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": "C003",
    "nombre": "Ana Torres",
    "email": "ana@correo.com",
    "telefono": "0977777777",
    "ciudad": "Cuenca",
    "perfilCompra": "OTRO"
  }'
```

Resultado esperado: error 400 indicando que el perfil no es reconocido.

## Endpoints

| Servicio | URL | Descripcion |
|---|---|---|
| Integracion XYZ | `POST http://localhost:8080/api/clientes/enviar` | Recibe el cliente desde XYZ y decide el destino |
| Empresa 123 | `POST http://localhost:8081/api/clientes` | Recibe clientes digitales |
| Empresa ABC | `POST http://localhost:8082/api/clientes` | Recibe clientes presenciales |

## Regla de negocio

La regla esta implementada en:

```text
integration-service/src/main/java/com/xyz/integration/routes/ClienteRouterRoute.java
```

La ruta Camel evalua el campo `perfilCompra` con JSONPath.

```text
$.perfilCompra == 'DIGITAL'     -> Empresa 123
$.perfilCompra == 'PRESENCIAL' -> Empresa ABC
```

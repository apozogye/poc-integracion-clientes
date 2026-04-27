# Arquitectura de la POC

## Vista general

```text
+-------------------+
| Empresa XYZ       |
| CRM Odoo Cloud    |
+---------+---------+
          |
          | JSON / REST
          v
+-----------------------------+
| integration-service         |
| Apache Camel                |
| Content-Based Router        |
| Puerto 8080                 |
+-------------+---------------+
              |
      +-------+--------+
      |                |
      v                v
+-------------+   +-------------+
| Empresa 123 |   | Empresa ABC |
| Puerto 8081 |   | Puerto 8082 |
+-------------+   +-------------+
```

## Patron Content-Based Router

El patron Content-Based Router revisa el contenido del mensaje y decide a que endpoint enviarlo. En esta POC, la decision se toma con el campo `perfilCompra`.

## Ventajas

- XYZ no depende directamente de los sistemas internos de Empresa 123 ni Empresa ABC.
- Se puede cambiar el destino sin modificar el CRM.
- Se pueden agregar nuevos perfiles y nuevas empresas al consorcio.
- El intercambio usa JSON, formato acordado entre las empresas.

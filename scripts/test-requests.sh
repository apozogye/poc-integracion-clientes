#!/usr/bin/env bash
set -e

BASE_URL="http://localhost:8089/api/clientes/enviar"

echo "\nCaso 1: cliente DIGITAL, debe enviarse a Empresa 123"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": "C001",
    "nombre": "Maria Lopez",
    "email": "maria@correo.com",
    "telefono": "0999999999",
    "ciudad": "Quito",
    "perfilCompra": "DIGITAL"
  }'
echo "\n"

echo "Caso 2: cliente PRESENCIAL, debe enviarse a Empresa ABC"
curl -s -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": "C002",
    "nombre": "Carlos Perez",
    "email": "carlos@correo.com",
    "telefono": "0988888888",
    "ciudad": "Guayaquil",
    "perfilCompra": "PRESENCIAL"
  }'
echo "\n"

echo "Caso 3: perfil invalido, debe responder error 400"
curl -s -i -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": "C003",
    "nombre": "Ana Torres",
    "email": "ana@correo.com",
    "telefono": "0977777777",
    "ciudad": "Cuenca",
    "perfilCompra": "OTRO"
  }'
echo "\n"

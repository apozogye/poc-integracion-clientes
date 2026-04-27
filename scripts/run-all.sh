#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"

cd "$ROOT_DIR"

echo "Compilando proyecto..."
mvn clean package

echo "Iniciando Empresa 123 en puerto 8081..."
java -jar empresa123-service/target/empresa123-service-1.0.0.jar > "$LOG_DIR/empresa123.log" 2>&1 &
PID_123=$!

echo "Iniciando Empresa ABC en puerto 8082..."
java -jar empresaabc-service/target/empresaabc-service-1.0.0.jar > "$LOG_DIR/empresaabc.log" 2>&1 &
PID_ABC=$!

echo "Esperando servicios receptores..."
sleep 5

echo "Iniciando servicio de integracion en puerto 8080..."
java -jar integration-service/target/integration-service-1.0.0.jar > "$LOG_DIR/integration.log" 2>&1 &
PID_INTEGRATION=$!

echo "Servicios iniciados."
echo "Empresa 123 PID: $PID_123"
echo "Empresa ABC PID: $PID_ABC"
echo "Integracion PID: $PID_INTEGRATION"
echo "Logs en: $LOG_DIR"
echo "Para probar: ./scripts/test-requests.sh"
echo "Para detener: kill $PID_123 $PID_ABC $PID_INTEGRATION"

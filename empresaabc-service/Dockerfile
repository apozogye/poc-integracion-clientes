FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# IMPORTANTE: este Dockerfile se construye con contexto en la raiz del proyecto
COPY . .

RUN mvn -pl empresaabc-service -am clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/empresaabc-service/target/*.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java", "-jar", "app.jar"]

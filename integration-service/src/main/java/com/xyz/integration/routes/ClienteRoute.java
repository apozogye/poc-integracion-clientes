package com.xyz.integration.routes;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.dataformat.JsonLibrary;
import org.springframework.stereotype.Component;

@Component
public class ClienteRoute extends RouteBuilder {

    @Override
    public void configure() {

        restConfiguration()
            .component("servlet");

        rest("/clientes")
            .post("/enviar")
            .consumes("application/json")
            .produces("application/json")
            .to("direct:procesarCliente");

        from("direct:procesarCliente")
            .routeId("ruta-clientes-xyz")
            .log("Cliente recibido desde XYZ: ${body}")
            .unmarshal().json(JsonLibrary.Jackson, java.util.Map.class)

            .choice()
                .when(simple("${body[perfilCompra]} == 'DIGITAL'"))
                    .log("Cliente con perfil DIGITAL. Enviando a Empresa 123")
                    .marshal().json(JsonLibrary.Jackson)
                    .to("direct:empresa123")

                .when(simple("${body[perfilCompra]} == 'PRESENCIAL'"))
                    .log("Cliente con perfil PRESENCIAL. Enviando a Empresa ABC")
                    .marshal().json(JsonLibrary.Jackson)
                    .to("direct:empresaABC")

                .otherwise()
                    .log("Perfil de compra no reconocido: ${body[perfilCompra]}")
                    .setHeader("Content-Type", constant("application/json"))
                    .setBody(simple("{\"estado\":\"ERROR\",\"mensaje\":\"Perfil de compra no reconocido\"}"))
            .end();

        from("direct:empresa123")
            .routeId("envio-empresa-123")
            .removeHeaders("CamelHttp*")
            .setHeader("Content-Type", constant("application/json"))
            .setHeader("CamelHttpMethod", constant("POST"))
            .to("http://localhost:8081/api/clientes?throwExceptionOnFailure=false")
            .log("Respuesta Empresa 123: ${body}");

        from("direct:empresaABC")
            .routeId("envio-empresa-abc")
            .removeHeaders("CamelHttp*")
            .setHeader("Content-Type", constant("application/json"))
            .setHeader("CamelHttpMethod", constant("POST"))
            .to("http://localhost:8082/api/clientes?throwExceptionOnFailure=false")
            .log("Respuesta Empresa ABC: ${body}");
    }
}
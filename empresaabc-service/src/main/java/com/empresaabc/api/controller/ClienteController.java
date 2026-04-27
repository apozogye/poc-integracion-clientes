package com.empresaabc.api.controller;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Simula el servicio web de Empresa ABC.
 * Esta empresa recibe clientes abordados en linea que prefieren cerrar la compra presencialmente.
 */
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> recibirCliente(@RequestBody Map<String, Object> cliente) {
        System.out.println("Empresa ABC recibio cliente PRESENCIAL: " + cliente);

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("estado", "OK");
        respuesta.put("empresa", "ABC");
        respuesta.put("tipoCliente", "PRESENCIAL");
        respuesta.put("mensaje", "Cliente recibido correctamente por Empresa ABC");
        respuesta.put("fechaRecepcion", Instant.now().toString());
        respuesta.put("clienteRecibido", cliente);

        return ResponseEntity.ok(respuesta);
    }
}

#ifndef RELAYS_NAME_HPP
#define RELAYS_NAME_HPP

#include <Arduino.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <WebServer.h>

// Define la estructura RelayNames
struct RelayNames {
    String device1;
    String device2;
    String device3;
    String device4;
    String device5;
    String device6;
};

// Declarar variables globales
extern WebServer server;
extern RelayNames relayNames;

// Función para guardar los nombres de los relés
inline void saveRelayNames(const RelayNames &relayNames) {
    File file = SPIFFS.open("/relaysName.json", "w");
    if (!file) {
        Serial.println("Failed to open file for writing");
        return;
    }

    DynamicJsonDocument doc(1024);
    doc["device1"] = relayNames.device1;
    doc["device2"] = relayNames.device2;
    doc["device3"] = relayNames.device3;
    doc["device4"] = relayNames.device4;
    doc["device5"] = relayNames.device5;
    doc["device6"] = relayNames.device6;

    serializeJson(doc, file);
    file.close();
}

// Función para manejar la solicitud de obtener los nombres de los relés
inline void handleGetRelayNames() {
    DynamicJsonDocument doc(1024);
    doc["device1"] = relayNames.device1;
    doc["device2"] = relayNames.device2;
    doc["device3"] = relayNames.device3;
    doc["device4"] = relayNames.device4;
    doc["device5"] = relayNames.device5;
    doc["device6"] = relayNames.device6;

    String response;
    serializeJson(doc, response);
    server.send(200, "application/json", response);
}

// Función para manejar la solicitud de actualizar el nombre de un relé
inline void handleUpdateRelayName() {
    DynamicJsonDocument doc(1024);
    if (deserializeJson(doc, server.arg("plain")) == DeserializationError::Ok) {
        String deviceId = doc["id"].as<String>();
        String newName = doc["name"].as<String>();

        if (deviceId == "1") relayNames.device1 = newName;
        else if (deviceId == "2") relayNames.device2 = newName;
        else if (deviceId == "3") relayNames.device3 = newName;
        else if (deviceId == "4") relayNames.device4 = newName;
        else if (deviceId == "5") relayNames.device5 = newName;
        else if (deviceId == "6") relayNames.device6 = newName;

        saveRelayNames(relayNames);

        server.send(200, "text/plain", "OK");
    } else {
        server.send(400, "text/plain", "Bad Request");
    }
}

#endif // RELAYS_NAME_HPP

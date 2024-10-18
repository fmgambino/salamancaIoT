#ifndef RESETAP_HPP
#define RESETAP_HPP

#include <WebServer.h>
#include <WiFiManager.h>

extern WebServer server; // Declaración del servidor web
extern WiFiManager wifiManager; // Declaración de WiFiManager

// Define el manejador para la solicitud de reseteo del modo AP
void handleResetAP() {
    // Detiene el servidor web actual
    server.stop();

    // Obtiene la dirección MAC del ESP32
    String mac = WiFi.macAddress();

    // Extrae los últimos 6 caracteres de la dirección MAC sin los ":"
    String macSuffix = mac.substring(9); // Extrae los últimos 6 caracteres, incluyendo ":"
    macSuffix.replace(":", ""); // Elimina los ":" del sufijo

    // Crea el SSID con el sufijo de la MAC
    String ssid = "SPDUWiFi_" + macSuffix;

    // Convierte el SSID a un array de caracteres
    char ssidChar[ssid.length() + 1];
    ssid.toCharArray(ssidChar, ssid.length() + 1);

    // Define la contraseña para el modo AP
    const char* password = "12345678";

    // Resetea el modo AP y reconfigura WiFiManager con el nuevo SSID y la contraseña
    wifiManager.resetSettings();
    wifiManager.startConfigPortal(ssidChar, password);

    Serial.println("Reiniciando ESP32...");
    delay(2000); // Esperar antes de reiniciar
    ESP.restart(); // Reinicia el ESP32

    // Envía una respuesta al cliente
    server.send(200, "application/json", "{\"success\": true}");
}

#endif // RESETAP_HPP

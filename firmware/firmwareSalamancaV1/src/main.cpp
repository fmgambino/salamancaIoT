/* ------------------------------------------------------------------- 
 * SmartPDU - JEFNet 2024/08
 * Sitio WEB: https://smartpdu.online
 * Correo: admim@smartpdu.online
 * Cel_WSP: +54 3816150488
 * Plataforma: ESP32
 * Framework:  Arduino
 * Proyecto SmartPDU para el ESP32 con HTML, JavaScript, CSS
 * SmartPDU Panel Admin v1.0
 * ------------------------------------------------------------------- 
 */

// -------------------------------------------------------------------
// Librerías
// -------------------------------------------------------------------
#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <WiFiManager.h>
#include <ESPmDNS.h>  // Biblioteca mDNS
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <SPIFFS.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

// -------------------------------------------------------------------
// Archivos *.hpp - Fragmentar el Código
// -------------------------------------------------------------------
#include "relaysConfig.hpp"  // Incluyendo la configuración de relés
#include "relaysName.hpp"

// Definición de los pines y tipo de sensor DHT y DS18B20
#define DHTPIN 4
#define DHTTYPE DHT22
#define ONE_WIRE_BUS 2
#define BATTERY_PIN 34  // Pin analógico para la batería
#define MQ135_PIN 32    // Pin Analógico Sensor de Gas MQ-135
#define MQ9_PIN // Pin Analógico Sensor de Gas MQ-9

WebServer server(80); //Asignacion de puerto
WiFiManager wifiManager;

String ssidAP;
// Obtén la dirección MAC del ESP32
String mac = WiFi.macAddress();
const char* mDNSName = "salamandra"; // Definición global del nombre de mDNS

// Dirección IP fija para el ESP32
IPAddress local_IP(192, 168, 100, 184);
IPAddress gateway(192, 168, 100, 1);
IPAddress subnet(255, 255, 255, 0);

// Inicialización de Sensores
DHT dht(DHTPIN, DHTTYPE);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);

// Definición de la variable relayNames
RelayNames relayNames;

// Declaración de la función para controlar relés
void handleRelayControl();

void redirectToLocalIP() {
    String localIP = WiFi.localIP().toString();
    Serial.println("Redirigiendo a: http://" + localIP);

    // Envía la redirección al cliente
    server.sendHeader("Location", "http://" + localIP, true);
    server.send(302, "text/plain", "");
}

void setup() {
    Serial.begin(115200);
    delay(1000);

    // Configuración de la conexión WiFi con IP estática
    WiFi.config(local_IP, gateway, subnet);

    /**** CONFIGURACION MODO AP *****
    *********************************/

    // Extrae los últimos 4 caracteres de la dirección MAC
    String macSuffix = mac.substring(mac.length() - 8);
    macSuffix.replace(":", ""); // Elimina los ":" del sufijo

    // Crea el SSID con el sufijo de la MAC
    String ssid = "SalamandraWiFi_" + macSuffix;

    // Convertir el SSID a un array de caracteres para WiFiManager
    char ssidChar[ssid.length() + 1];
    ssid.toCharArray(ssidChar, ssid.length() + 1);

    // Iniciar el autoConnect con el SSID modificado
    wifiManager.autoConnect(ssidChar, "12345678");

    // Configurar WiFiManager
    wifiManager.setConfigPortalTimeout(5);  // Tiempo de espera de 5 minutos para configuración

    // Callback para guardar la configuración cuando WiFi esté conectado
    wifiManager.setSaveConfigCallback([]() {
        Serial.println("WiFi configurado. Redirigiendo...");
        delay(1000);
        redirectToLocalIP();  // Redirigir a la IP local una vez conectado
    });

    // Conexión a la red WiFi
    Serial.println();
    Serial.print("Conectando a ");
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("Conectado a WiFi");
    Serial.print("Dirección IP: ");
    Serial.println(WiFi.localIP());

    // Inicializar mDNS
    if (!MDNS.begin(mDNSName)) {
        Serial.println("Error al iniciar mDNS. No se puede acceder a http://salamandra.local");
    } else {
        Serial.println("mDNS iniciado correctamente. Puedes acceder a tu ESP32 en http://salamandra.local");
    }

    // Montaje del sistema de archivos SPIFFS
    if (!SPIFFS.begin(true)) {
        Serial.println("Error al montar SPIFFS");
        return;
    }
    Serial.println("SPIFFS montado correctamente");

    // Configuración del servidor para servir archivos estáticos
    server.on("/", HTTP_GET, []() {
        File file = SPIFFS.open("/index.html", "r");
        if (!file) {
            server.send(404, "text/plain", "Archivo no encontrado");
            return;
        }
        server.streamFile(file, "text/html");
        file.close();
    });

    server.on("/styles.css", HTTP_GET, []() {
        File file = SPIFFS.open("/styles.css", "r");
        if (!file) {
            server.send(404, "text/plain", "Archivo no encontrado");
            return;
        }
        server.streamFile(file, "text/css");
        file.close();
    });

    server.on("/relaysBox.css", HTTP_GET, []() {
        File file = SPIFFS.open("/relaysBox.css", "r");
        if (!file) {
            server.send(404, "text/plain", "Archivo no encontrado");
            return;
        }
        server.streamFile(file, "text/css");
        file.close();
    });

    server.on("/script.js", HTTP_GET, []() {
        File file = SPIFFS.open("/script.js", "r");
        if (!file) {
            server.send(404, "text/plain", "Archivo no encontrado");
            return;
        }
        server.streamFile(file, "application/javascript");
        file.close();
    });

    // Incluir el archivo editNameRelays.js
    server.on("/editNameRelays.js", HTTP_GET, []() {
        File file = SPIFFS.open("/editNameRelays.js", "r");
        if (!file) {
            server.send(404, "text/plain", "Archivo no encontrado");
            return;
        }
        server.streamFile(file, "application/javascript");
        file.close();
    });

    // Configurar las rutas del servidor para los relés
    server.on("/get-relay-names", HTTP_GET, handleGetRelayNames);
    server.on("/update-relay-name", HTTP_POST, handleUpdateRelayName);
    server.on("/relay", HTTP_GET, handleRelayControl); // Ruta para controlar los relés

    // Ruta para obtener el nivel de batería
    server.on("/battery", HTTP_GET, []() {
        int analogValue = analogRead(BATTERY_PIN);
        float voltage = analogValue * (3.3 / 4095.0); // Convertir el valor analógico a voltaje
        int batteryLevel = map(voltage * 1000, 3000, 4200, 0, 100); // Asumiendo una batería de 3.0V a 4.2V

        if (batteryLevel > 100) batteryLevel = 100;
        if (batteryLevel < 0) batteryLevel = 0;

        String json = "{\"battery\":" + String(batteryLevel) + "}";
        server.send(200, "application/json", json);
    });

    // Ruta para obtener datos del sensor DHT22
    server.on("/dht22", HTTP_GET, []() {
        float humidity = dht.readHumidity();
        float temperature = dht.readTemperature();
        if (isnan(humidity) || isnan(temperature)) {
            Serial.println("Error al leer el sensor DHT22");
            server.send(500, "application/json", "{\"error\":\"Error al leer el DHT22\"}");
            return;
        }

        String json = "{\"humidity\":" + String(humidity) + ", \"temperature\":" + String(temperature) + "}";
        server.send(200, "application/json", json);
    });

    // Ruta para obtener datos del sensor DS18B20
    server.on("/ds18b20", HTTP_GET, []() {
        ds18b20.requestTemperatures();
        float temperature = ds18b20.getTempCByIndex(0);
        if (temperature == DEVICE_DISCONNECTED_C) {
            server.send(500, "application/json", "{\"error\":\"Error al leer el DS18B20\"}");
            return;
        }
        String json = "{\"temperature\":" + String(temperature) + "}";
        server.send(200, "application/json", json);
    });

    // Ruta para obtener datos del sensor MQ-135
    server.on("/mq135", HTTP_GET, []() {
        int analogValue = analogRead(MQ135_PIN);
        float airQuality = analogValue * (3.3 / 4095.0); // Convertir el valor analógico a concentración
        String json = "{\"air_quality\":" + String(airQuality) + "}";
        server.send(200, "application/json", json);
    });

    // Iniciar servidor HTTP
    server.begin();
    Serial.println("Servidor HTTP iniciado");

    // Inicializar sensores
    dht.begin();
    ds18b20.begin();
}

void loop() {
    server.handleClient();  // Manejo de solicitudes del cliente
}

// Implementación de la función handleRelayControl
void handleRelayControl() {
    if (server.hasArg("relay") && server.hasArg("state")) {
        int relayId = server.arg("relay").toInt();
        String state = server.arg("state");

        // Lógica para activar o desactivar el relé
        if (state == "on") {
            digitalWrite(relayId, HIGH);
            server.send(200, "text/plain", "Relay " + String(relayId) + " activated");
        } else {
            digitalWrite(relayId, LOW);
            server.send(200, "text/plain", "Relay " + String(relayId) + " deactivated");
        }
    } else {
        server.send(400, "text/plain", "Bad Request: Missing parameters");
    }
}
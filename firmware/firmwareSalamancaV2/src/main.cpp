/* -------------------------------------------------------------------
 * SmartPDU - JEFNet 2024/08
 * Sitio WEB: https://smartpdu.online
 * Correo: admim@smartpdu.online
 * Cel_WSP: +54 3816150488
 * Plataforma: ESP32
 * Framework:  Arduino
 * Proyecto SmartPDU para el ESP32 con HTNL, JavaScript, CSS
 * SmartPDU Panel Admin v1.0
 * -------------------------------------------------------------------
*/

// -------------------------------------------------------------------
// Librerias
// -------------------------------------------------------------------
#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <WiFiManager.h>
#include <ESPmDNS.h>  // Biblioteca mDNS
#include <Wire.h>
#include <U8g2lib.h> //Manejo OLED 1.3"
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <freertos/task.h>
#include <freertos/semphr.h>

// -------------------------------------------------------------------
// Archivos *.h - Fragmentar el Código
// -------------------------------------------------------------------
#include "oledDisplay.h"
#include <freertos/FreeRTOS.h>
// Librería para NTP
#include <TimeLib.h> // Incluye la biblioteca TimeLib

// -------------------------------------------------------------------
// Archivos *.hpp - Fragmentar el Código
// -------------------------------------------------------------------
//#include "resetPDU.hpp"
#include "oledDisplay.hpp"  // Incluir el header creado
#include "oledTasks.hpp"  // Incluye el archivo de encabezado con las funciones
#include "logoSmartPDU.hpp"  // Incluye el archivo de encabezado que declara el bitmap
#include "mediciones.hpp"
#include "consumoMAX.hpp"
#include "relayConfig.h"
#include "relaysName.hpp"
#include "login.hpp"
#include "resetAP.hpp" //Reseteo del Modo AP
// Configuración del servidor NTP con zona horaria UTC-3
WiFiUDP udp;
NTPClient timeClient(udp, "pool.ntp.org", -10800, 60000); // UTC-3, actualizar cada 60 segundos

LoginServer loginServer(server);

SemaphoreHandle_t relayMutex;
SemaphoreHandle_t spiFFSMutex;
SemaphoreHandle_t oledMutex;

// Se Crea una instancia de la clase MedicionesAC
MedicionesAC mediciones(34, 35); // Usa los pines correspondientes para corriente y tensión

#define DHTPIN 4 // Pin donde está conectado el sensor DHT22
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// #define RELAY_COUNT 6
// const int relayPins[RELAY_COUNT] = {14, 27, 26, 25, 33, 32};
// bool relayStates[RELAY_COUNT] = {false};

WebServer server(80); //Asignacion de puerto
WiFiManager wifiManager;
// Obtén la dirección MAC del ESP32
String mac = WiFi.macAddress();
const char* mDNSName = "smartpdu"; // Definición global del nombre de mDNS

// Variable global para almacenar el ID del dispositivo
String deviceID;
String nameDevice;
RelayNames relayNames;

// Funciones para generar el ID del dispositivo
String hexStr(const unsigned long &h, const byte &l = 8) {
    String s = String(h, HEX);
    s.toUpperCase();
    s = ("00000000" + s).substring(s.length() + 8 - l);
    return s;
}

String idUnique() {
    char idunique[15]; 
    uint64_t chipid = ESP.getEfuseMac();           
    uint16_t chip = (uint16_t)(chipid >> 32);
    snprintf(idunique, 15, "%04X", chip);
    return idunique;
}

String generateDeviceID() {
    return "ESP32" + hexStr(ESP.getEfuseMac()) /*+ String(idUnique())*/;
}

String generateNameDevice() {
    uint64_t chipid = ESP.getEfuseMac();
    return "PDU" + hexStr(ESP.getEfuseMac()) /*+ String(idUnique())*/ + "B";
}


/**********************************************************
 * *********** FUNCIONES NECESARIA ************************
 **********************************************************/

void saveRelayStates() {
    if (xSemaphoreTake(spiFFSMutex, portMAX_DELAY) == pdTRUE) {
        File file = SPIFFS.open("/relayStates.json", FILE_WRITE);
        if (!file) {
            Serial.println("Error al abrir relayStates.json para escribir");
            xSemaphoreGive(spiFFSMutex);
            return;
        }
        StaticJsonDocument<200> doc;
        for (int i = 0; i < RELAY_COUNT; i++) {
            doc[String("relay") + (i + 1)] = relayStates[i] ? "ON" : "OFF";
        }
        serializeJson(doc, file);
        file.close();
        xSemaphoreGive(spiFFSMutex);
    }
}

void loadRelayStates() {
    if (xSemaphoreTake(spiFFSMutex, portMAX_DELAY) == pdTRUE) {
        if (!SPIFFS.exists("/relayStates.json")) {
            Serial.println("El archivo relayStates.json no existe.");
            xSemaphoreGive(spiFFSMutex);
            return;
        }
        File file = SPIFFS.open("/relayStates.json", FILE_READ);
        if (!file) {
            Serial.println("Error al abrir relayStates.json para leer.");
            xSemaphoreGive(spiFFSMutex);
            return;
        }
        StaticJsonDocument<200> doc;
        DeserializationError error = deserializeJson(doc, file);
        if (error) {
            Serial.println("Error al parsear relayStates.json.");
            xSemaphoreGive(spiFFSMutex);
            return;
        }
        file.close();
        for (int i = 0; i < RELAY_COUNT; i++) {
            String relayKey = String("relay") + (i + 1);
            if (doc.containsKey(relayKey)) {
                relayStates[i] = doc[relayKey] == "ON";
                digitalWrite(relayPins[i], relayStates[i] ? LOW : HIGH);
            }
        }
        xSemaphoreGive(spiFFSMutex);
    }
}

void redirectToLocalIP() {
    String localIP = WiFi.localIP().toString();
    Serial.println("Redirigiendo a: http://" + localIP);

    // Envía la redirección al cliente
    server.sendHeader("Location", "http://" + localIP, true);
    server.send(302, "text/plain", "");
}

//************************************
//***** DECLARACION FUNCIONES ********
//************************************

void fResumen();
void fDatosPdu();
void fDatosRed();
void fElectricos();
void fAmbiente();

// Declaración de funciones ResetPDU
void incrementResetCounter();
void handleRoot();
void handleResetCount();
void handleResetLog();

// Declaraciones de las funciones
String formatTime(time_t epochTime) {
    char buffer[20];
    struct tm *timeinfo = localtime(&epochTime);
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", timeinfo);
    return String(buffer);
}
// Declaracion para Ordenar Registros
String getLastLogs(int n) {
    File file = SPIFFS.open("/logs.txt", "r");
    if (!file) {
        return "Error abriendo el archivo de registros.";
    }

    String logs = "";
    String line;
    int totalLines = 0;

    // Primero, contamos el número de líneas
    while (file.available()) {
        line = file.readStringUntil('\n');
        totalLines++;
    }

    // Nos posicionamos en las últimas n líneas
    file.seek(0); // Volvemos al principio del archivo
    int startLine = max(0, totalLines - n); // Asegúrate de no ir más allá de la primera línea
    int currentLine = 0;

    while (file.available()) {
        line = file.readStringUntil('\n');
        if (currentLine >= startLine) {
            logs = line + "\n" + logs; // Agregamos al principio para tenerlos en orden descendente
        }
        currentLine++;
    }

    file.close();
    return logs;
}

int getResetCount();

void setup() {
    Serial.begin(115200);

    // Inicializar nombre del dispositivo y ID
    nameDevice = generateNameDevice();
    deviceID = generateDeviceID();

    // Configura las rutas relacionadas con el inicio de sesión
    loginServer.setupRoutes();

    // Inicializar mutex
    relayMutex = xSemaphoreCreateMutex();
    spiFFSMutex = xSemaphoreCreateMutex();
    oledMutex = xSemaphoreCreateMutex();

    if (relayMutex == NULL || spiFFSMutex == NULL || oledMutex == NULL) {
        Serial.println("Error al crear mutex");
        return;
    }

    // Inicializa la pantalla OLED
    oled.begin();
    oled.clearBuffer(); 
    oled.drawBitmap(0, 0, 128/8, 64, logoSmartPDUBitmap);
    oled.sendBuffer();
    delay(2000);

    oled.clearBuffer();
    oled.setFont(u8g2_font_ncenB08_tr); // Establecer fuente
    oled.drawStr(25, 40, "Inicializando...!"); // Dibujar texto
    oled.sendBuffer(); 
    delay(1000);

    // Configurar WiFiManager
    wifiManager.setConfigPortalTimeout(180); // Tiempo de espera de 3 minutos para configuración
    wifiManager.setSaveConfigCallback([]() {
        Serial.println("WiFi configurado. Redirigiendo...");
        oled.clearBuffer();
        oled.setFont(u8g2_font_ncenB08_tr); 
        oled.drawStr(25, 40, "Conectando WiFi...!");
        oled.sendBuffer(); 
        delay(1000);
        redirectToLocalIP();
    });

    /**** CONFIGURACION MODO AP *****
    *********************************/

    // Extrae los últimos 4 caracteres de la dirección MAC
    String macSuffix = mac.substring(mac.length() - 8);
    macSuffix.replace(":", ""); // Elimina los ":" del sufijo

    // Crea el SSID con el sufijo de la MAC
    String ssid = "SPDUWiFi_" + macSuffix;

    // Convierte el SSID a un array de caracteres
    char ssidChar[ssid.length() + 1];
    ssid.toCharArray(ssidChar, ssid.length() + 1);

    // Inicia el autoConnect con el SSID modificado
    wifiManager.autoConnect(ssidChar, "12345678");

    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("No se pudo conectar a la red Wi-Fi.");
        oled.clearBuffer();
        oled.setFont(u8g2_font_ncenB08_tr); 
        oled.drawStr(25, 40, "Error Conexion WiFi!");
        oled.sendBuffer(); 
        delay(1000);
        return;
    }

    Serial.println("Conectado a WiFi");
    oled.clearBuffer();
    oled.setFont(u8g2_font_ncenB08_tr); 
    oled.drawStr(25, 30, "Conexion WIFI...!");
    oled.drawStr(25, 40, "EXITOSA...!");
    oled.sendBuffer(); 
    delay(500);

    // Iniciar el servicio mDNS
    if (!MDNS.begin(mDNSName)) {
        Serial.println("Error al iniciar mDNS");
        return;
    }
    Serial.println("mDNS iniciado correctamente. Puedes acceder a tu ESP32 en http://smartpdu.local");

    // Iniciar SPIFFS
    if (!SPIFFS.begin(true)) {
        Serial.println("Error al montar SPIFFS");
        return;
    }

    // Inicializar NTP
  timeClient.begin();

  // Incrementar y registrar el contador de reinicios
  incrementResetCounter();


  // Configurar el servidor web
    server.on("/resetCountPDU", HTTP_GET, handleResetCount);
    server.on("/resetLog", HTTP_GET, handleResetLog);  // Añadir el manejador para `/resetLog`
    server.begin();

    // Configurar pines de los relés
    for (int i = 0; i < RELAY_COUNT; i++) {
        pinMode(relayPins[i], OUTPUT);
        digitalWrite(relayPins[i], HIGH);
    }

    // Cargar estados de los relés desde SPIFFS
    loadRelayStates();

    // Define el manejador para la solicitud de reseteo del modo AP
    server.on("/resetAP", HTTP_POST, handleResetAP);

// Configuración del servidor web y los endpoints
server.on("/", HTTP_GET, []() {
    File file = SPIFFS.open("/index.html", FILE_READ);
    if (!file) {
        server.send(404, "text/plain", "File not found");
        return;
    }
    server.streamFile(file, "text/html");
    file.close();
});

server.on("/css/panel.css", HTTP_GET, []() {
    File file = SPIFFS.open("/css/panel.css", FILE_READ);
    if (!file) {
        server.send(404, "text/plain", "File not found");
        return;
    }
    server.streamFile(file, "text/css");
    file.close();
});

server.on("/css/switchToggles.css", HTTP_GET, []() {
    File file = SPIFFS.open("/css/switchToggles.css", FILE_READ);
    if (!file) {
        server.send(404, "text/plain", "File not found");
        return;
    }
    server.streamFile(file, "text/css");
    file.close();
});

server.on("/js/panel.js", HTTP_GET, []() {
    File file = SPIFFS.open("/js/panel.js", FILE_READ);
    if (!file) {
        server.send(404, "text/plain", "File not found");
        return;
    }
    server.streamFile(file, "application/javascript");
    file.close();
});

server.on("/js/editNameRelays.js", HTTP_GET, []() {
    File file = SPIFFS.open("/js/editNameRelays.js", FILE_READ);
    if (!file) {
        server.send(404, "text/plain", "File not found");
        return;
    }
    server.streamFile(file, "application/javascript");
    file.close();
});

server.on("/js/resetAP.js", HTTP_GET, []() {
    File file = SPIFFS.open("/js/resetAP.js", FILE_READ);
    if (!file) {
        server.send(404, "text/plain", "File not found");
        return;
    }
    server.streamFile(file, "application/javascript");
    file.close();
});

// Cargar los nombres de los relés desde SPIFFS
    File file = SPIFFS.open("/relaysName.json", "r");
    if (file) {
        DynamicJsonDocument doc(1024);
        DeserializationError error = deserializeJson(doc, file);
        if (!error) {
            relayNames.device1 = doc["device1"].as<String>();
            relayNames.device2 = doc["device2"].as<String>();
            relayNames.device3 = doc["device3"].as<String>();
            relayNames.device4 = doc["device4"].as<String>();
            relayNames.device5 = doc["device5"].as<String>();
            relayNames.device6 = doc["device6"].as<String>();
        }
        file.close();
    }

    // Configurar las rutas del servidor
    server.on("/relay-names", HTTP_GET, handleGetRelayNames);
    server.on("/update-relay-name", HTTP_POST, handleUpdateRelayName);



    server.on("/relay-status", HTTP_GET, []() {
        StaticJsonDocument<200> doc;
        for (int i = 0; i < RELAY_COUNT; i++) {
            doc[String("relay") + (i + 1)] = relayStates[i] ? "ON" : "OFF";
        }
        String json;
        serializeJson(doc, json);
        server.send(200, "application/json", json);
    });

    server.on("/battery", HTTP_GET, []() {
        StaticJsonDocument<200> doc;
        doc["battery"] = 75; // Valor ficticio, reemplazar con la lectura real de batería
        String json;
        serializeJson(doc, json);
        server.send(200, "application/json", json);
    });

    // Inicia las mediciones
    mediciones.iniciarMediciones();

   // Configura la ruta para /electroMeter
server.on("/electroMeter", HTTP_GET, []() {
    StaticJsonDocument<256> doc;
    doc["corrienteAC"] = mediciones.getCorrienteRMS();
    doc["voltajeAC"] = mediciones.getVoltageRMS();
    doc["potenciaAparente"] = mediciones.getPotenciaAparente();
    doc["potenciaActiva"] = mediciones.getPotenciaActiva();
    doc["consumoEnergia"] = mediciones.getConsumoEnergia();
    doc["frecuenciaAC"] = mediciones.getFrecuenciaAC();
    doc["factorPotencia"] = mediciones.getFactorPotenciaActiva(); // Usamos getFactorPotenciaActiva()

    // Mostrar los valores en el monitor serial
    Serial.print("Corriente AC: ");
    Serial.println(mediciones.getCorrienteRMS());

    Serial.print("Voltaje AC: ");
    Serial.println(mediciones.getVoltageRMS());

    Serial.print("Potencia Aparente: ");
    Serial.println(mediciones.getPotenciaAparente());

    Serial.print("Potencia Activa: ");
    Serial.println(mediciones.getPotenciaActiva());

    Serial.print("Consumo de Energía: ");
    Serial.println(mediciones.getConsumoEnergia());

    Serial.print("Frecuencia AC: ");
    Serial.println(mediciones.getFrecuenciaAC());

    Serial.print("Factor de Potencia Activa: ");
    Serial.println(mediciones.getFactorPotenciaActiva());

    String json;
    serializeJson(doc, json);
    server.send(200, "application/json", json);
});

    server.on("/dht22", HTTP_GET, []() {
        float temperature = dht.readTemperature();
        float humidity = dht.readHumidity();
        StaticJsonDocument<200> doc;
        doc["temperature"] = temperature;
        doc["humidity"] = humidity;
        String json;
        serializeJson(doc, json);
        server.send(200, "application/json", json);
    });

    server.on("/relay", HTTP_GET, []() {
    if (server.hasArg("relay") && server.hasArg("state")) {
        int relay = server.arg("relay").toInt();
        String state = server.arg("state");

        if (relay >= 1 && relay <= RELAY_COUNT) {
            relayStates[relay - 1] = (state == "off");
            digitalWrite(relayPins[relay - 1], relayStates[relay - 1] ? LOW : HIGH);

            saveRelayStates();

            // Cambiar a JSON
            server.send(200, "application/json", "{\"status\":\"OK\"}");
            return;
        }
    }
    // Cambiar a JSON
    server.send(400, "application/json", "{\"status\":\"Bad Request\"}");
});

    server.on("/pdu", HTTP_GET, []() {
        String json = "{\"device\":\"" + nameDevice +  "\",\"id-serie-pdu\":\"" + deviceID + "\"}";
        server.send(200, "application/json", json);           
    });

    server.on("/network", HTTP_GET, []() {
        String json = "{\"ip-ap\":\"" + WiFi.softAPIP().toString() + "\",\"ssid-wifi\":\"" + WiFi.SSID() + "\",\"wifi-signal\":" + String(WiFi.RSSI()) + "}";
        server.send(200, "application/json", json);
    });

    server.on("/ip", HTTP_GET, []() {
        String json = "{\"ip-webserver\":\"" + WiFi.localIP().toString() + "\"}";
        server.send(200, "application/json", json);
    });

    server.begin();
    Serial.println("Servidor web iniciado");
    dht.begin();

    // Inicialización del sistema
    // La tarea TaskOLED se crea en oledTasks.cpp, por lo que no es necesario hacerlo aquí.
    xTaskCreatePinnedToCore(TaskOLED, "TaskOLED", 8192, NULL, 1, NULL, 0);
}

void loop() {
    server.handleClient();
}

void incrementResetCounter() {
  File file = SPIFFS.open("/resetPDURegister.txt", FILE_APPEND);
  if (!file) {
    Serial.println("Error al abrir el archivo");
    return;
  }

  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  String formattedTime = formatTime(epochTime);
  
  int resetCount = getResetCount() + 1;

  file.printf("Reset %d: %s\n", resetCount, formattedTime.c_str());
  file.close();

  // Guardar el nuevo contador
  file = SPIFFS.open("/resetCount.txt", FILE_WRITE);
  if (file) {
    file.print(resetCount);
    file.close();
  }
}

String formatTime(unsigned long epochTime) {
  // Configurar el tiempo en la biblioteca TimeLib
  setTime(epochTime);
  
  // Formatear el tiempo
  String formattedTime = "";
  formattedTime += String(year()) + "-";
  formattedTime += String(month()) + "-";
  formattedTime += String(day()) + " ";
  formattedTime += String(hour()) + ":";
  formattedTime += String(minute()) + ":";
  formattedTime += String(second());
  
  return formattedTime;
}

int getResetCount() {
  File file = SPIFFS.open("/resetCount.txt", FILE_READ);
  if (!file) {
    return 0;
  }
  int count = file.parseInt();
  file.close();
  return count;
}

/* void handleRoot() {
  String html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>ESP32 Reset Counter</title></head><body>";
  html += "<div class='reset-counter'><i class='fas fa-redo-alt reset-icon'></i>";
  html += "<span class='reset-text'>Reset PDU: <span id='resetCount'>";
  html += String(getResetCount());
  html += "</span></span></div></body></html>";
  server.send(200, "text/html", html);
} */

void handleResetCount() {
    int resetCount = getResetCount();  // Obtiene el número de reinicios

    // Crea un objeto JSON
    StaticJsonDocument<200> doc;
    doc["restart_count"] = resetCount;

    // Serializa el objeto JSON y lo envía como respuesta
    String response;
    serializeJson(doc, response);
    server.send(200, "application/json", response);
}

void handleResetLog() {
    
    if (SPIFFS.exists("/resetPDURegister.txt")) {
        File file = SPIFFS.open("/resetPDURegister.txt", FILE_READ);
        if (!file) {
            server.send(500, "text/plain", "Error al abrir el archivo de registro");
            return;
        }

        String logContent = "";
        while (file.available()) {
            logContent += file.readStringUntil('\n') + "<br>"; // Agregar salto de línea HTML
        }
        file.close();

        server.send(200, "text/html", logContent);

        String logs = getLastLogs(10); // Obtiene los últimos 10 registros
        server.send(200, "text/plain", logs);

    } else {
        server.send(404, "text/plain", "Registro no encontrado");
    }
}
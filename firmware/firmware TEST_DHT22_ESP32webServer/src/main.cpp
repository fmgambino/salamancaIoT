#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <SPIFFS.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Definición de los pines y tipo de sensor DHT y DS18B20
#define DHTPIN 4
#define DHTTYPE DHT22
#define ONE_WIRE_BUS 2
#define BATTERY_PIN 34  // Pin analógico para la batería

// Credenciales de la red WiFi
const char* ssid = "JUAREZ";
const char* password = "CAROLINA342";

// Configuración de IP fija
IPAddress local_IP(192, 168, 1, 184);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

// Inicialización del servidor web y los sensores
WebServer server(80);
DHT dht(DHTPIN, DHTTYPE);
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);

// Variables para los sensores MQ
int mq135Pin = 34;
int mq9Pin = 35;

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Conexión a la red WiFi con IP fija
  if (!WiFi.config(local_IP, gateway, subnet)) {
    Serial.println("Error al configurar la IP estática");
  }

  Serial.println();
  Serial.print("Conectando a ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("Conectado a WiFi");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());
  
  // Montaje del sistema de archivos SPIFFS
  if (!SPIFFS.begin(true)) {
    Serial.println("Error al montar SPIFFS");
    return;
  }

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

  server.on("/script.js", HTTP_GET, []() {
    File file = SPIFFS.open("/script.js", "r");
    if (!file) {
      server.send(404, "text/plain", "Archivo no encontrado");
      return;
    }
    server.streamFile(file, "application/javascript");
    file.close();
  });

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
        server.send(500, "application/json", "{\"error\":\"Error al leer el sensor DHT22\"}");
    } else {
        Serial.println("Datos del sensor DHT22 obtenidos correctamente");
        String json = "{\"temperature\":" + String(temperature) + ",\"humidity\":" + String(humidity) + "}";
        server.send(200, "application/json", json);
    }
  });

  // Ruta para obtener datos del sensor DS18B20
  server.on("/ds18b20", HTTP_GET, []() {
    ds18b20.requestTemperatures();
    float temperature = ds18b20.getTempCByIndex(0);
    if (temperature == DEVICE_DISCONNECTED_C) {
      Serial.println("Error al leer el sensor DS18B20");
      server.send(500, "application/json", "{\"error\":\"Error al leer el sensor DS18B20\"}");
    } else {
      Serial.println("Datos del sensor DS18B20 obtenidos correctamente");
      String json = "{\"temperature\":" + String(temperature) + "}";
      server.send(200, "application/json", json);
    }
  });

  // Ruta para obtener datos del sensor MQ-135
  server.on("/mq135", HTTP_GET, []() {
    int airQualityPPM = analogRead(mq135Pin);
    int airQualityCO2 = analogRead(mq135Pin); // Aquí puedes ajustar para el CO2 si tienes otra lectura
    String json = "{\"air_quality_ppm\":" + String(airQualityPPM) + ",\"air_quality_co2\":" + String(airQualityCO2) + "}";
    server.send(200, "application/json", json);
  });

  // Ruta para obtener datos del sensor MQ-9
  server.on("/mq9", HTTP_GET, []() {
    int coLevel = analogRead(mq9Pin);
    String json = "{\"co_level\":" + String(coLevel) + "}";
    server.send(200, "application/json", json);
  });

  server.begin();
  
  Serial.println("Servidor HTTP iniciado");
  dht.begin();
  ds18b20.begin();
}

void loop() {
  server.handleClient();
}

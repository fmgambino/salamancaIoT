#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <SPIFFS.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>

// Definición de los pines y tipo de sensor DHT
#define DHTPIN 4
#define DHTTYPE DHT22

// Credenciales de la red WiFi
const char* ssid = "JUAREZ";
const char* password = "CAROLINA342";

// Inicialización del servidor web y el sensor DHT
WebServer server(80);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Conexión a la red WiFi
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

  // Lectura y impresión del contenido de text.txt en el monitor serial
  File file = SPIFFS.open("/text.txt", "r");
  if (!file) {
    Serial.println("Error al abrir el archivo text.txt");
  } else {
    Serial.println("Contenido de text.txt:");
    while (file.available()) {
      Serial.write(file.read());
    }
    file.close();
  }

  // Lectura y impresión del contenido de index.html en el monitor serial
  file = SPIFFS.open("/index.html", "r");
  if (!file) {
    Serial.println("Error al abrir el archivo index.html");
  } else {
    Serial.println("\nContenido de index.html:");
    while (file.available()) {
      Serial.write(file.read());
    }
    file.close();
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

  // Ruta para servir el contenido de text.txt
  server.on("/text.txt", HTTP_GET, []() {
    if (!SPIFFS.exists("/text.txt")) {
      server.send(404, "text/plain", "Archivo no encontrado");
      return;
    }
    File file = SPIFFS.open("/text.txt", "r");
    if (!file) {
      server.send(500, "text/plain", "Error interno del servidor");
      return;
    }
    server.streamFile(file, "text/plain");
    file.close();
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

  server.begin();
  
  Serial.println("Servidor HTTP iniciado");
  dht.begin();
}

void loop() {
  server.handleClient();
}

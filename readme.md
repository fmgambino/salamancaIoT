
[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

![MI-iPhone](https://electronicagambino.com/wp-content/uploads/elementor/thumbs/cropped-Electronica-Gambino-e1684335474114-q6losum0uq8caxhait9doqxx83gv53yq2d8g8oiv7o.png)

![version](https://img.shields.io/badge/version-1.0.0-blue.svg?longCache=true&style=flat-square)
![license](https://img.shields.io/badge/license-MIT-green.svg?longCache=true&style=flat-square)

# Dispositivo de Control y Monitoreo de Variables Multiparamétricas para Salamancas

Este proyecto está diseñado de control y monitoreo de variables multiparamétricas en Salamancas, utilizando el microcontrolador ESP32. El dispositivo es capaz de recolectar y transmitir datos de diferentes sensores para facilitar el análisis en tiempo real.

## Requisitos

### Hardware
- ESP32
- Sensores multiparamétricos (por ejemplo, temperatura, humedad, pH, etc.)
- Cables de conexión
- Fuente de alimentación

### Software
- Arduino IDE o VSCode con PlatformIO
- Librerías específicas para los sensores utilizados

## Instalación

### Configurar el Arduino IDE o VSCode con PlatformIO
1. **Arduino IDE**: Instalar el [Arduino IDE](https://www.arduino.cc/en/software) y agregar el soporte para ESP32 desde el [Gestor de Placas](https://github.com/espressif/arduino-esp32).
2. **VSCode con PlatformIO**: 
   - Instalar [VSCode](https://code.visualstudio.com/).
   - Instalar la extensión PlatformIO desde el Marketplace de VSCode.

### Configurar el proyecto en PlatformIO
1. Crear un nuevo proyecto en PlatformIO y seleccionar la placa ESP32.
2. Añadir las librerías necesarias para los sensores en el archivo `platformio.ini` del proyecto.

```
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
lib_deps = 
    adafruit/DHT sensor library @ ^1.4.2
    adafruit/Adafruit Unified Sensor @ ^1.1.4
```

## Conexión de Hardware

### Sensor de Temperatura y Humedad DHT22

Conectar el sensor DHT22 al ESP32 de la siguiente manera:

- VCC -> 3.3V
- GND -> GND
- DATA -> Pin GPIO4

## 📋 Esquema de Conexión ESP32 & SENSORES:

![Esquema de Conexión ESP32 & Sensores](https://i.ibb.co/Y0Qp4Gc/esquema-ESP32-DHT22.jpg)

### Otros Sensores
Dependiendo de los sensores adicionales que se utilicen, las conexiones pueden variar. Asegúrate de seguir los diagramas de conexión específicos para cada sensor.

## Código Ejemplo (Firmware)

```
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Pines de los sensores
#define DHTPIN1 4
#define DHTPIN2 5
#define DHTPIN3 18
#define ONE_WIRE_BUS 19
#define MQ135_PIN 34

// Configuración de los sensores DHT22
#define DHTTYPE DHT22
DHT_Unified dht1(DHTPIN1, DHTTYPE);
DHT_Unified dht2(DHTPIN2, DHTTYPE);
DHT_Unified dht3(DHTPIN3, DHTTYPE);

// Configuración del sensor DS18B20
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Pines de salida
#define RELAY1_PIN 26
#define RELAY2_PIN 27
#define MOSFET1_PIN 14
#define MOSFET2_PIN 12
#define TRIAC1_PIN 25
#define TRIAC2_PIN 33
#define BATTERY_PIN 35

void setup() {
  Serial.begin(115200);
  
  // Inicializar los sensores DHT22
  dht1.begin();
  dht2.begin();
  dht3.begin();

  // Inicializar el sensor DS18B20
  sensors.begin();

  // Configurar pines de salida
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(MOSFET1_PIN, OUTPUT);
  pinMode(MOSFET2_PIN, OUTPUT);
  pinMode(TRIAC1_PIN, OUTPUT);
  pinMode(TRIAC2_PIN, OUTPUT);
  pinMode(BATTERY_PIN, INPUT);
}

void loop() {
  // Leer los sensores DHT22
  sensors_event_t event;
  dht1.temperature().getEvent(&event);
  if (!isnan(event.temperature)) {
    Serial.print(F("DHT1 Temperatura: "));
    Serial.print(event.temperature);
    Serial.println(F("°C"));
  }
  dht1.humidity().getEvent(&event);
  if (!isnan(event.relative_humidity)) {
    Serial.print(F("DHT1 Humedad: "));
    Serial.print(event.relative_humidity);
    Serial.println(F("%"));
  }

  dht2.temperature().getEvent(&event);
  if (!isnan(event.temperature)) {
    Serial.print(F("DHT2 Temperatura: "));
    Serial.print(event.temperature);
    Serial.println(F("°C"));
  }
  dht2.humidity().getEvent(&event);
  if (!isnan(event.relative_humidity)) {
    Serial.print(F("DHT2 Humedad: "));
    Serial.print(event.relative_humidity);
    Serial.println(F("%"));
  }

  dht3.temperature().getEvent(&event);
  if (!isnan(event.temperature)) {
    Serial.print(F("DHT3 Temperatura: "));
    Serial.print(event.temperature);
    Serial.println(F("°C"));
  }
  dht3.humidity().getEvent(&event);
  if (!isnan(event.relative_humidity)) {
    Serial.print(F("DHT3 Humedad: "));
    Serial.print(event.relative_humidity);
    Serial.println(F("%"));
  }

  // Leer el sensor DS18B20
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  if (tempC != DEVICE_DISCONNECTED_C) {
    Serial.print(F("DS18B20 Temperatura: "));
    Serial.print(tempC);
    Serial.println(F("°C"));
  }

  // Leer el sensor MQ-135
  int mq135Value = analogRead(MQ135_PIN);
  Serial.print(F("MQ-135 Lectura: "));
  Serial.println(mq135Value);

  // Leer el nivel de la batería
  int batteryLevel = analogRead(BATTERY_PIN);
  Serial.print(F("Nivel de Batería: "));
  Serial.println(batteryLevel);

  delay(2000);
}

```

### Sensores de Temperatura y Humedad DHT22

Conectar los sensores DHT22 al ESP32 de la siguiente manera:

- DHT22-1:
  - VCC -> 3.3V
  - GND -> GND
  - DATA -> Pin GPIO4

- DHT22-2:
  - VCC -> 3.3V
  - GND -> GND
  - DATA -> Pin GPIO5

- DHT22-3:
  - VCC -> 3.3V
  - GND -> GND
  - DATA -> Pin GPIO18

### Sensor de Temperatura DS18B20

Conectar el sensor DS18B20 al ESP32 utilizando el protocolo OneWire:

- VCC -> 3.3V
- GND -> GND
- DATA -> Pin GPIO19

### Sensor de Gas MQ-135

Conectar el sensor MQ-135 al ESP32:

- VCC -> 5V
- GND -> GND
- AOUT -> Pin GPIO34

### Componentes de Salida

- Relé 1:
  - CONTROL -> Pin GPIO26

- Relé 2:
  - CONTROL -> Pin GPIO27

- MOSFET 1:
  - CONTROL -> Pin GPIO14

- MOSFET 2:
  - CONTROL -> Pin GPIO12

- TRIAC 1:
  - CONTROL -> Pin GPIO25

- TRIAC 2:
  - CONTROL -> Pin GPIO33

### Nivel de Batería

- Nivel de Batería:
  - SENSOR -> Pin GPIO35

## Solución de Problemas
- **El ESP32 no se conecta a la red Wi-Fi**: Asegúrate de que la configuración Wi-Fi en el código es correcta y que estás dentro del alcance de la señal.
- **Lecturas incorrectas de los sensores**: Verifica las conexiones y asegúrate de que los sensores están funcionando correctamente.

## Contribuciones
Las contribuciones a este proyecto son bienvenidas. Si encuentras algún problema o tienes alguna mejora, no dudes en abrir un issue o enviar un pull request.

## Licencia
Este proyecto está licenciado bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

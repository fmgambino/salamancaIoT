
![version](https://img.shields.io/badge/version-1.0.0-blue.svg?longCache=true&style=flat-square)
![license](https://img.shields.io/badge/license-MIT-green.svg?longCache=true&style=flat-square)

# Dispositivo para el Control y Monitoreo de Variables Multiparamétricas para Salamancas

Este proyecto está diseñado para el control y monitoreo de variables multiparamétricas en Salamancas, utilizando el microcontrolador ESP32. El dispositivo es capaz de recolectar y transmitir datos de diferentes sensores para facilitar el análisis en tiempo real.

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

\`\`\`ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
lib_deps = 
    adafruit/DHT sensor library @ ^1.4.2
    adafruit/Adafruit Unified Sensor @ ^1.1.4
\`\`\`

## Conexión de Hardware

### Sensor de Temperatura y Humedad DHT22

Conectar el sensor DHT22 al ESP32 de la siguiente manera:

- VCC -> 3.3V
- GND -> GND
- DATA -> Pin GPIO4

## 📋 Esquema de Conexión ESP32 & DHT22:

![Esquema de Conexión ESP32 & DHT22](https://i.ibb.co/Y0Qp4Gc/esquema-ESP32-DHT22.jpg)

### Otros Sensores
Dependiendo de los sensores adicionales que se utilicen, las conexiones pueden variar. Asegúrate de seguir los diagramas de conexión específicos para cada sensor.

## Código Ejemplo (Firmware)

\`\`\`cpp
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN 4      // Pin al que está conectado el sensor
#define DHTTYPE DHT22 // Tipo de sensor

DHT_Unified dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println(F("Dispositivo de Monitoreo de Variables Multiparamétricas"));
}

void loop() {
  // Obtener datos del sensor de temperatura y humedad
  sensors_event_t event;
  dht.temperature().getEvent(&event);
  if (!isnan(event.temperature)) {
    Serial.print(F("Temperatura: "));
    Serial.print(event.temperature);
    Serial.println(F("°C"));
  }
  dht.humidity().getEvent(&event);
  if (!isnan(event.relative_humidity)) {
    Serial.print(F("Humedad: "));
    Serial.print(event.relative_humidity);
    Serial.println(F("%"));
  }
  delay(2000);
}
\`\`\`

## Información sobre los Sensores Utilizados

### Sensor DHT22
El sensor DHT22 es un sensor de temperatura y humedad de alta precisión. Es capaz de medir temperaturas de -40 a 80 °C y humedad de 0 a 100% RH con buena precisión.

## Solución de Problemas
- **El ESP32 no se conecta a la red Wi-Fi**: Asegúrate de que la configuración Wi-Fi en el código es correcta y que estás dentro del alcance de la señal.
- **Lecturas incorrectas de los sensores**: Verifica las conexiones y asegúrate de que los sensores están funcionando correctamente.

## Contribuciones
Las contribuciones a este proyecto son bienvenidas. Si encuentras algún problema o tienes alguna mejora, no dudes en abrir un issue o enviar un pull request.

## Licencia
Este proyecto está licenciado bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

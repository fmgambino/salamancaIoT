#include <U8g2lib.h>
#include <Wire.h>
#include <WiFi.h>
#include "oledDisplay.h"
#include "oledDisplay.hpp"
#include "Icons.hpp"
#include "relayConfig.h"
#include <ESPmDNS.h>
#include "mediciones.hpp"

extern const char* mDNSName;

// Definición de la variable oled
U8G2_SH1106_128X64_NONAME_F_HW_I2C oled(U8G2_R0, /* reset=*/ U8X8_PIN_NONE, /* clock=*/ 22, /* data=*/ 21);

// Variable para el interlineado
const uint8_t lineSpacing = 12; // Ajusta este valor según tus necesidades

// Fuente global
const uint8_t *currentFont = u8g2_font_6x10_tf;  // Fuente predeterminada

extern MedicionesAC mediciones;

void fResumen() {
    //oled.clearBuffer();
    oled.setFont(currentFont);

    uint8_t yPosition = 10;  // Iniciar desde la parte superior de la pantalla

    // Mostrar el nombre del dispositivo
    oled.drawStr(0, yPosition, "Device:");
    oled.setCursor(50, yPosition);
    oled.print(nameDevice); 
    yPosition += lineSpacing;

    // Estado eléctrico
    oled.drawStr(0, yPosition, "Estado:");
    String estadoElectrico = String(mediciones.getVoltageRMS(), 1) + "V " +
                             String(mediciones.getConsumoEnergia(), 1) + "W";
    oled.setCursor(50, yPosition);
    oled.print(estadoElectrico);
    yPosition += lineSpacing;

    // Estado climático
    oled.drawStr(0, yPosition, "Clima:");
    String estadoClimatico = String(dht.readTemperature(), 1) + "C " +
                             String(dht.readHumidity(), 1) + "% ";
    oled.setCursor(50, yPosition);
    oled.print(estadoClimatico);
    yPosition += lineSpacing;

    // Señal WiFi
    oled.drawStr(0, yPosition, "Red:");
    int rssi = WiFi.RSSI(); 
    String signalStrength;
    if (rssi >= -76) signalStrength = "Excelente";
    else if (rssi >= -89) signalStrength = "Muy buena";
    else if (rssi >= -97) signalStrength = "Buena";
    else if (rssi >= -103) signalStrength = "Baja";
    else if (rssi >= -112) signalStrength = "Bajisima";
    else if (rssi >= -135) signalStrength = "Muy poca";
    else signalStrength = "Sin cobertura";
    oled.setCursor(50, yPosition);
    oled.print(signalStrength);
    yPosition += lineSpacing;

    // Mostrar los relés inactivos
String inactiveRelays = "ON: ";
bool first = false;
for (int i = 0; i < RELAY_COUNT; i++) {
    if (!relayStates[i]) {  // Cambia aquí para verificar relés inactivos
        if (first) inactiveRelays += ", ";  // Si no es el primer relé inactivo, añade una coma
        inactiveRelays += String(i + 1);
        first = true;
    }
}
if (!first) inactiveRelays += "NINGUNO";  // Si no se encontró ningún relé inactivo, muestra "NINGUNO"
oled.drawStr(0, yPosition, inactiveRelays.c_str());


    oled.sendBuffer();
    vTaskDelay(pdMS_TO_TICKS(10000));
}

void fDatosPdu() {
    oled.clearBuffer();
    oled.setFont(currentFont);

    oled.drawStr(0, 10, "SmartPDU:");

    uint8_t yPosition = 25;

    oled.drawStr(0, yPosition, "Nombre:");
    oled.setCursor(50, yPosition);
    oled.print(nameDevice);
    yPosition += lineSpacing;

    oled.drawStr(0, yPosition, "SN:");
    oled.setCursor(50, yPosition);
    oled.print(deviceID);
    yPosition += lineSpacing;

    oled.drawStr(0, yPosition, "AP IP:");
    oled.setCursor(50, yPosition);
    oled.print(WiFi.softAPIP().toString());
    yPosition += lineSpacing;

    // Mostrar los relés inactivos
String inactiveRelays = "ON: ";
bool first = false;
for (int i = 0; i < RELAY_COUNT; i++) {
    if (!relayStates[i]) {  // Cambia aquí para verificar relés inactivos
        if (first) inactiveRelays += ", ";  // Si no es el primer relé inactivo, añade una coma
        inactiveRelays += String(i + 1);
        first = true;
    }
}
if (!first) inactiveRelays += "NINGUNO";  // Si no se encontró ningún relé inactivo, muestra "NINGUNO"
oled.drawStr(0, yPosition, inactiveRelays.c_str());


    oled.sendBuffer();
    vTaskDelay(pdMS_TO_TICKS(10000));
}

void fDatosRed() {
    oled.clearBuffer();
    oled.setFont(currentFont);

    // Título
    oled.drawStr(0, 10, "Datos REDES:");

    uint8_t yPosition = 25;  // Posición vertical inicial
    
    // Mostrar IP LAN
    oled.drawStr(0, yPosition, "LAN:");
    oled.setCursor(37, yPosition);  // Desplaza a la izquierda
    oled.print(WiFi.localIP().toString());
    yPosition += 10;

    // Mostrar SSID
    oled.drawStr(0, yPosition, "SSID:");
    oled.setCursor(37, yPosition);  // Desplaza a la izquierda
    oled.print(WiFi.SSID());
    yPosition += 10;    

    // Mostrar intensidad de señal
    oled.drawStr(0, yPosition, "Red:");
    oled.setCursor(37, yPosition);  // Desplaza a la izquierda
    int rssi = WiFi.RSSI();
    String signalStrength;
    if (rssi >= -76) signalStrength = "Excelente";
    else if (rssi >= -89) signalStrength = "Muy buena";
    else if (rssi >= -97) signalStrength = "Buena/Media";
    else if (rssi >= -103) signalStrength = "Baja cob.";
    else if (rssi >= -112) signalStrength = "Bajisima";
    else if (rssi >= -135) signalStrength = "Muy poca";
    else signalStrength = "Sin cob.";
    oled.print(signalStrength);
    yPosition += 10;

    // Mostrar nombre de mDNS
    oled.drawStr(0, yPosition, "mDNS:");
    oled.setCursor(37, yPosition);  // Desplaza a la izquierda
    oled.print(mDNSName);

    // Enviar el buffer a la pantalla
    oled.sendBuffer();
    
    // Retardo antes de actualizar nuevamente
    vTaskDelay(pdMS_TO_TICKS(10000));
}


void fElectricos() {
    oled.clearBuffer();
    oled.setFont(currentFont);

    oled.drawStr(0, 10, "Datos Electricos:");

    uint8_t yPosition = 25;

    oled.drawStr(0, yPosition, "Corriente:");
    oled.setCursor(80, yPosition);
    oled.print(mediciones.getCorrienteRMS(), 2);
    oled.drawStr(110, yPosition, "A");
    yPosition += lineSpacing;

    oled.drawStr(0, yPosition, "Voltaje:");
    oled.setCursor(80, yPosition);
    oled.print(mediciones.getVoltageRMS(), 2);
    oled.drawStr(110, yPosition, "V");
    yPosition += lineSpacing;

    oled.drawStr(0, yPosition, "Consumo:");
    oled.setCursor(80, yPosition);
    oled.print(mediciones.getConsumoEnergia(), 2);
    oled.drawStr(110, yPosition, "W");
    yPosition += lineSpacing;

    oled.drawStr(0, yPosition, "CosPhi:");
    oled.setCursor(80, yPosition);
    oled.print(mediciones.getFactorPotenciaActiva(), 2);

    oled.sendBuffer();
    vTaskDelay(pdMS_TO_TICKS(10000));
}

void fAmbiente() {
    oled.clearBuffer();
    oled.setFont(currentFont);

    oled.drawStr(0, 10, "Datos Ambientales:");

    uint8_t yPosition = 25;

    oled.drawStr(0, yPosition, "Temp:");
    oled.setCursor(60, yPosition);
    oled.print(dht.readTemperature(), 1);
    oled.drawStr(90, yPosition, "C");
    yPosition += lineSpacing;

    oled.drawStr(0, yPosition, "Hum:");
    oled.setCursor(60, yPosition);
    oled.print(dht.readHumidity(), 1);
    oled.drawStr(90, yPosition, "%");

    oled.sendBuffer();
    delay(3000);
}
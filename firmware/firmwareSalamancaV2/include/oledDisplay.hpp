#pragma once

#include <Arduino.h>
#include <Wire.h>
#include <U8g2lib.h>
#include "logoSmartPDU.hpp"  // Incluye el archivo del logo
#include <DHT.h>  // Incluye la librería del DHT
#include "relayConfig.h"  // Incluye el archivo con la configuración de los relés

// Configuración del display OLED (ajusta según tu configuración)
extern U8G2_SH1106_128X64_NONAME_F_HW_I2C oled;

// Variables globales
extern String nameDevice;
extern String deviceID;
extern const unsigned char tempIcon[];
extern const unsigned char humidityIcon[];
extern const uint8_t *currentFont;  // Cambiado a const uint8_t *

// Declara el objeto DHT
extern DHT dht;  // Declara el objeto DHT como externo

// Declaraciones de funciones
void fResumen();
void fDatosPdu();
void fDatosRed();
void fElectricos();
void fAmbiente();
void initOLED();
void updateOLED();  // Función para actualizar la pantalla OLED con los estados de los relés

#pragma once
#include <Arduino.h>

// Declaración de las funciones para inicializar y actualizar la OLED
void initOLED();
void updateOLED();

// Declaración de la tarea FreeRTOS para la OLED
void TaskOLED(void *pvParameters);

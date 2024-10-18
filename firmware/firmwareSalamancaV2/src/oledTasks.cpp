#include <U8g2lib.h>
#include <Wire.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include "oledTasks.hpp"
#include "oledDisplay.hpp"
#include "relayConfig.h"  // Incluye el archivo de configuración de relés

// Declaración externa del objeto OLED
extern U8G2_SH1106_128X64_NONAME_F_HW_I2C oled;

// Función para inicializar el OLED
void initOLED() {
    oled.begin();  // Inicializa el OLED
    oled.setFont(u8g2_font_lubB08_tr);  // Establece la fuente por defecto
    // Otras configuraciones del OLED si es necesario
}

// Función para actualizar el OLED
void updateOLED() {
    oled.clearBuffer(); // Limpia el buffer antes de dibujar

    // Mostrar Resumen de Datos PDU
    fResumen();

    // Mostrar datos del PDU
    fDatosPdu();

    // Mostrar datos de red
    fDatosRed();

    // Mostrar datos eléctricos
    fElectricos();

    // Mostrar datos ambientales
    fAmbiente();

    // Mostrar estado de los relés
/*     for (int i = 0; i < RELAY_COUNT; i++) {
        oled.setCursor(0, 10 + i * 10);  // Ajusta la posición en el buffer
        oled.print("Relay ");
        oled.print(i + 1);
        oled.print(": ");
        oled.print(relayStates[i] ? "ON" : "OFF");
    } */

    oled.sendBuffer(); // Envía el buffer de dibujo a la pantalla
}

// Función que se ejecutará en el núcleo 0 (pantalla OLED)
void TaskOLED(void *pvParameters) {
    initOLED();  // Inicializar el OLED
    while (true) {
        updateOLED();  // Actualizar el OLED periódicamente
        vTaskDelay(pdMS_TO_TICKS(1000)); // Espera de 1 segundo
    }
}

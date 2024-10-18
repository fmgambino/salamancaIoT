#ifndef CONSUMOMAX_HPP
#define CONSUMOMAX_HPP

#include "relayConfig.h"  // Incluye la cabecera relayConfig.h
#include "mediciones.hpp" // Incluye la cabecera para acceder a MedicionesAC

void verificarConsumoMaximo(MedicionesAC& medicionesAC) {
    // Obtenemos la corriente RMS
    float corrienteTotal = medicionesAC.getCorrienteRMS();
    float amperMax = 0.50; // Amperaje máximo permitido

    // Verificamos si la corriente supera el amperaje máximo
    if (corrienteTotal > amperMax) {
        // Apagamos todos los relés
        for (int i = 0; i < RELAY_COUNT; i++) {
            digitalWrite(relayPins[i], LOW); // Apagar el relé (HIGH para desactivar)
            relayStates[i] = false; // Actualizar el estado del relé
        }
    }
}

// Implementación de la función de tarea FreeRTOS
void IRAM_ATTR verificarConsumoTask(void *parameter) {
    MedicionesAC* medicionesAC = static_cast<MedicionesAC*>(parameter);
    while (true) {
        verificarConsumoMaximo(*medicionesAC);
        vTaskDelay(pdMS_TO_TICKS(5000)); // Verificar cada 5 segundos
    }
}

#endif // CONSUMOMAX_HPP

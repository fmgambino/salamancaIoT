#include "relayConfig.h"
#include <Arduino.h>

// Inicialización de los pines de los relés
const int relayPins[RELAY_COUNT] = {14, 27, 26, 25, 33, 32};
bool relayStates[RELAY_COUNT] = {false, false, false, false, false, false}; // Inicialmente activos

// Configuración inicial de los relés
void setupRelays() {
    for (int i = 0; i < RELAY_COUNT; i++) {
        pinMode(relayPins[i], OUTPUT);
        digitalWrite(relayPins[i], LOW); // Configurar pines en LOW para que los relés estén activos (NC)
    }
}

// Función para establecer el estado de un relé
void setRelayState(int relayIndex, bool state) {
    if (relayIndex >= 0 && relayIndex < RELAY_COUNT) {
        relayStates[relayIndex] = state;
        digitalWrite(relayPins[relayIndex], state ? LOW : HIGH); // LOW para activar (NC), HIGH para desactivar
    }
}

// Función para obtener el estado de un relé
bool getRelayState(int relayIndex) {
    if (relayIndex >= 0 && relayIndex < RELAY_COUNT) {
        return relayStates[relayIndex];
    }
    return false;
}

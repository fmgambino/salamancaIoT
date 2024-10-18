#ifndef RELAYSCONFIG_HPP
#define RELAYSCONFIG_HPP

#include <Arduino.h>

// Definición de la cantidad de relés
const int RELAY_COUNT = 6;

// Inicialización de los pines de los relés
const int relayPins[RELAY_COUNT] = {14, 27, 26, 25, 33, 32};

// Inicialización de los estados de los relés
bool relayStates[RELAY_COUNT] = {false, false, false, false, false, false}; // Inicialmente apagados

// Inicializa los pines de los relés como salidas
void setupRelays() {
    for (int i = 0; i < RELAY_COUNT; i++) {
        pinMode(relayPins[i], OUTPUT);
        digitalWrite(relayPins[i], LOW); // Asegúrate de que los relés estén apagados al inicio
    }
}

// Función para cambiar el estado de un relé
void setRelayState(int relayIndex, bool state) {
    if (relayIndex < 0 || relayIndex >= RELAY_COUNT) {
        Serial.println("Índice de relé inválido");
        return;
    }
    relayStates[relayIndex] = state; // Actualiza el estado
    digitalWrite(relayPins[relayIndex], state ? HIGH : LOW);
}

// Función para obtener el estado de un relé
bool getRelayState(int relayIndex) {
    if (relayIndex < 0 || relayIndex >= RELAY_COUNT) {
        Serial.println("Índice de relé inválido");
        return false;
    }
    return relayStates[relayIndex]; // Devuelve el estado actual
}

#endif // RELAYSCONFIG_HPP

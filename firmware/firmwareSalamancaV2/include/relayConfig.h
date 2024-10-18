#ifndef RELAY_CONFIG_H
#define RELAY_CONFIG_H

// Definición de la cantidad de relés
#define RELAY_COUNT 6

// Definición de los pines donde están conectados los relés
extern const int relayPins[RELAY_COUNT];

// Estado inicial de los relés (falsos/inactivos)
extern bool relayStates[RELAY_COUNT];

#endif // RELAY_CONFIG_HPP

#ifndef MEDICIONES_HPP
#define MEDICIONES_HPP

#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/semphr.h>
#include <SPIFFS.h> // Incluye SPIFFS

class MedicionesAC {
private:
    int pinCorriente;
    int pinTension;
    float offsetCorriente;
    SemaphoreHandle_t mutexMediciones;

    float corrienteRMS;
    float voltageRMS;
    float frecuenciaAC;
    float potenciaAparente;
    float potenciaActiva;
    float potenciaReactiva;               // Nueva variable añadida
    float factorPotencia;
    float factorPotenciaActiva;           // Nueva variable añadida
    float factorPotenciaReactiva;         // Nueva variable añadida
    float consumoEnergia;
    unsigned long tiempoInicial;

    void calcularCorrienteRMS();
    void medirTensionYFrecuencia();
    void calcularPotencias();
    void guardarConsumoEnergia();         // Nueva función añadida
    float calcularDesplazamiento(int pinSensor);

public:
    MedicionesAC(int pinCorriente, int pinTension);
    void iniciarMediciones();
    void actualizarMediciones();

    float getCorrienteRMS();
    float getVoltageRMS();
    float getFrecuenciaAC();
    float getPotenciaAparente();
    float getPotenciaActiva();
    float getPotenciaReactiva();          // Nueva función añadida
    float getFactorPotencia();
    float getFactorPotenciaActiva();      // Nueva función añadida
    float getFactorPotenciaReactiva();    // Nueva función añadida
    float getConsumoEnergia();
};

//extern MedicionesAC medicionesAC;  // Declaración de la instancia global

#endif // MEDICIONES_HPP

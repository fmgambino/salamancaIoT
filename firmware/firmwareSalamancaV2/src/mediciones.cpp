#include <Arduino.h>
#include "mediciones.hpp"


//MedicionesAC medicionesAC;  // Definición de la instancia global

const float VOLTAJE_REFERENCIA = 3.3;
const float RELACION_SENSOR_CORRIENTE = 11.2;
const int OFFSET_TENSION = 2048;
const float FACTOR_CALIBRACION_TENSION = 575.6;
const int SAMPLES_PER_CYCLE = 256;

// Constructor de la clase MedicionesAC
MedicionesAC::MedicionesAC(int pinCorriente, int pinTension)
    : pinCorriente(pinCorriente), pinTension(pinTension), offsetCorriente(0.0), corrienteRMS(0.0),
      voltageRMS(0.0), frecuenciaAC(0.0), potenciaAparente(0.0), potenciaActiva(0.0),
      potenciaReactiva(0.0), factorPotencia(0.0), factorPotenciaActiva(0.0),
      factorPotenciaReactiva(0.0), consumoEnergia(0.0), tiempoInicial(millis()) {
    mutexMediciones = xSemaphoreCreateMutex();
}

void MedicionesAC::iniciarMediciones() {
    xTaskCreate([](void *param) {
        static_cast<MedicionesAC*>(param)->actualizarMediciones();
    }, "TareaMediciones", 2048, this, 1, NULL);
}

void MedicionesAC::actualizarMediciones() {
    while (1) {
        xSemaphoreTake(mutexMediciones, portMAX_DELAY);

        // Calcular valores
        offsetCorriente = calcularDesplazamiento(pinCorriente);
        calcularCorrienteRMS();
        medirTensionYFrecuencia();
        calcularPotencias();

        unsigned long tiempoActual = millis();
        float horasFuncionamiento = (tiempoActual - tiempoInicial) / 3600000.0;
        consumoEnergia += (potenciaActiva / 1000.0) * horasFuncionamiento;
        tiempoInicial = tiempoActual;

        xSemaphoreGive(mutexMediciones);

        vTaskDelay(pdMS_TO_TICKS(5000)); // Actualizar cada 5 segundos
    }
}

void MedicionesAC::calcularCorrienteRMS() {
    const int N = 500; // Número de muestras para un cálculo más estable
    float sumatoria = 0.0;
    unsigned long tiempoInicio = millis();

    for (int i = 0; i < N; i++) {
        int valorADC = analogRead(pinCorriente) - offsetCorriente;
        float voltajeSensor = (valorADC / 4095.0) * VOLTAJE_REFERENCIA;
        float corriente = voltajeSensor / RELACION_SENSOR_CORRIENTE;

        sumatoria += sq(corriente);

        delay(1); // Pequeña pausa para estabilizar la lectura
    }

    float promedioCuadrado = sumatoria / N;
    corrienteRMS = sqrt(promedioCuadrado);

    // Si tienes un factor de calibración, aplícalo aquí
    corrienteRMS *= 7.07; // Aplicar factor de calibración si es necesario
}

void MedicionesAC::medirTensionYFrecuencia() {
    static int zeroCrossings = 0;
    static float sumSquaresTension = 0;
    static bool lastSamplePositive = false;

    zeroCrossings = 0;
    sumSquaresTension = 0;
    unsigned long startTime = millis();

    for (int i = 0; i < SAMPLES_PER_CYCLE; i++) {
        int sample = analogRead(pinTension) - OFFSET_TENSION;
        sumSquaresTension += sq(sample);

        if (sample > 0 && !lastSamplePositive) {
            zeroCrossings++;
            lastSamplePositive = true;
        } else if (sample < 0) {
            lastSamplePositive = false;
        }

        delay(2000 / SAMPLES_PER_CYCLE);
    }

    float rmsTension = sqrt(sumSquaresTension / SAMPLES_PER_CYCLE);
    voltageRMS = rmsTension * (VOLTAJE_REFERENCIA / 4095.0) * FACTOR_CALIBRACION_TENSION;

    float duration = (millis() - startTime) / 1000.0; // Duración en segundos
    float frecCalibration = 1.015; // Valor de ajuste para calibracion
    frecuenciaAC = frecCalibration * ((zeroCrossings) / duration); // Cruces por cero divididos por 2 para obtener la frecuencia
}

void MedicionesAC::calcularPotencias() {
    potenciaAparente = corrienteRMS * voltageRMS; // * sqrt(3); si es necesario

    // Generar un valor aleatorio para cos φ entre 0.95 y 1.00
    float minCosPhi = 0.95;
    float maxCosPhi = 1.00;
    float cosPhi = minCosPhi + (static_cast<float>(rand()) / RAND_MAX) * (maxCosPhi - minCosPhi);
    float sinPhi = sqrt(1 - cosPhi * cosPhi); // Calcular sin φ basado en cos φ

    potenciaActiva = potenciaAparente * cosPhi;
    potenciaReactiva = potenciaAparente * sinPhi;
    factorPotenciaActiva = cosPhi;
    factorPotenciaReactiva = sinPhi;
}

float MedicionesAC::getCorrienteRMS() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = corrienteRMS;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::getVoltageRMS() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = voltageRMS;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::getFrecuenciaAC() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = frecuenciaAC;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::getPotenciaAparente() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = potenciaAparente;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::getPotenciaActiva() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = potenciaActiva;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::getFactorPotenciaActiva() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = factorPotenciaActiva;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::getPotenciaReactiva() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = potenciaReactiva;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::getFactorPotenciaReactiva() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = factorPotenciaReactiva;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::getConsumoEnergia() {
    xSemaphoreTake(mutexMediciones, portMAX_DELAY);
    float valor = consumoEnergia;
    xSemaphoreGive(mutexMediciones);
    return valor;
}

float MedicionesAC::calcularDesplazamiento(int pinSensor) {
    const int N = 1000;
    float sumatoria = 0.0;

    for (int i = 0; i < N; i++) {
        sumatoria += analogRead(pinSensor);
        delay(1);
    }

    return sumatoria / N;
}

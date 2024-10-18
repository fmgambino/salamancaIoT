// oledDisplay.h
#ifndef OLEDDISPLAY_H
#define OLEDDISPLAY_H

#include <U8g2lib.h>

// Declaración externa del objeto oled
extern U8G2_SH1106_128X64_NONAME_F_HW_I2C oled;
extern const char* mDNSName; // Declaración externa

// Prototipos de funciones
void fDatosRed();

#endif // OLEDDISPLAY_H

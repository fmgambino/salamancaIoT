Perfecto. Acá tenés el **prompt completo y final**, ya actualizado con el **sistema de suscripciones**, planes, restricciones por cantidad de dispositivos, visualización del plan activo en el panel cliente y bloqueo total del dashboard al vencer la suscripción.

---

# PROMPT COMPLETO FINAL

Quiero que actúes como **arquitecto de software senior, diseñador UX/UI senior, desarrollador full stack senior y especialista IoT**, con experiencia real en:

* **PWA con JavaScript**
* **Supabase gratuito**
* **ESP32 DEV Kit V1**
* **VS Code + PlatformIO**
* **Framework Arduino**
* **MQTT / EMQX**
* **dashboards industriales / monitoreo de sensores y actuadores**
* **sistemas con roles y permisos**
* **sistemas SaaS con suscripciones**
* **integración frontend + backend + hardware**

Necesito que diseñes y desarrolles una solución **completa, profesional, modular, escalable y lista para evolucionar a producción**, basada en un proyecto original existente, pero rediseñada y ampliada con muchas más funcionalidades.

La solución debe contemplar **frontend, backend, base de datos, autenticación, permisos, planes de suscripción, paneles, PWA, integración con broker MQTT, integración con dispositivos ESP32 y estrategia general de comunicación entre sistema web y hardware**.

---

# 1. Objetivo general del sistema

Quiero construir una **PWA en JavaScript** conectada a **Supabase gratuito** como backend principal, e integrada con **dispositivos ESP32 DEV Kit V1** programados en **VS Code con PlatformIO usando framework Arduino**.

El sistema debe permitir:

* autenticación completa
* administración de usuarios
* administración de clientes
* administración de dispositivos
* administración de roles y permisos
* panel administrador
* panel cliente/usuario final
* gestión de lugares
* visualización de sensores
* control de actuadores
* configuración de broker MQTT
* notificaciones
* instalación como app PWA en PC o celular
* integración con hardware real ESP32
* soporte para crecimiento futuro
* **sistema de suscripciones por plan**
* **bloqueo automático por suscripción vencida**

---

# 2. Stack obligatorio

## Frontend

* **JavaScript**
* UI moderna, profesional, responsive
* soporte claro/oscuro
* íconos SVG usando librería JS o CSS
* alertas con **SweetAlert2**
* siempre incluir **favicon**
* debe funcionar como **PWA**

## Backend

* **Supabase gratuito**
* Auth
* PostgreSQL
* Storage
* Realtime
* RLS
* funciones o triggers si aplica

## Hardware / IoT

* **ESP32 DEV Kit V1**
* **VS Code**
* **PlatformIO**
* **Framework Arduino**
* conexión por **WiFi**
* uso de **MQTT**
* integración con broker EMQX

## Broker MQTT

Usar como base:

* **Broker Host:** `broker.emqx.io`

Puertos:

* **TCP / Standard:** `1883`
* **WebSocket / Browser:** `8083`
* **TLS / Secure:** `8883`
* **WSS / Secure WS:** `8084`

---

# 3. Alcance general del producto

La solución debe cubrir 5 grandes áreas:

## A. Administración

Un administrador debe poder:

* ingresar al sistema
* ver dashboard general
* administrar usuarios
* administrar clientes
* administrar dispositivos
* administrar roles
* administrar permisos
* administrar lugares
* administrar broker
* ver notificaciones
* editar su perfil
* administrar planes y suscripciones
* visualizar clientes con plan activo, vencido o suspendido

## B. Cliente / Usuario final

Un cliente debe poder:

* ingresar al sistema
* visualizar dashboard de sensores y actuadores
* seleccionar lugar
* seleccionar dispositivo
* ver notificaciones
* administrar sus devices si tiene permiso
* editar su perfil
* cambiar foto
* usar modo claro/oscuro
* usar fullscreen
* salir del sistema
* ver su plan suscripto
* ver el vencimiento de su plan
* renovar o cambiar de plan

## C. Hardware ESP32

Cada dispositivo ESP32 debe poder:

* conectarse a WiFi
* conectarse al broker MQTT
* publicar datos de sensores
* recibir comandos para actuadores
* identificarse con un device_id único
* poder asignarse a un cliente/lugar desde la PWA
* reportar estado online/offline
* quedar asociado en la base de datos

## D. Integración PWA + Supabase + MQTT + ESP32

La arquitectura debe explicar con claridad:

* qué guarda Supabase
* qué circula por MQTT
* qué muestra la PWA
* cómo se relaciona cada ESP32 con usuarios, lugares y dispositivos
* cómo se gestionan sensores y actuadores
* cómo se sincronizan estados
* cómo se manejan eventos online/offline
* cómo se registran logs y notificaciones

## E. Suscripciones SaaS

La plataforma debe funcionar como un SaaS con planes pagos.
Cada cliente debe tener un plan activo o vencido, y el uso del sistema debe depender del estado de la suscripción.

---

# 4. Sistema de suscripciones obligatorio

Implementar un sistema de suscripción completo con estos planes:

## Planes

### Plan Emprender

* hasta **1 dispositivo**
* **USD 2.99 mensual**
* **USD 29.99 anual**

### Plan PyME

* hasta **5 dispositivos**
* **USD 14.99 mensual**
* **USD 129.99 anual**

### Plan Bussines

* **dispositivos ilimitados**
* **USD 99.99 mensual**
* **USD 999.99 anual**

## Reglas de negocio de suscripción

El sistema debe contemplar:

* cada cliente tiene un plan suscripto
* el plan puede ser mensual o anual
* debe guardarse fecha de inicio
* debe guardarse fecha de vencimiento
* debe guardarse estado de suscripción
* debe guardarse historial de suscripciones
* debe controlarse el máximo de dispositivos permitidos por plan
* el panel del cliente debe mostrar claramente el plan actual
* el panel debe mostrar estado: activo, vencido, suspendido, cancelado, pendiente
* si el plan está vencido, el cliente no puede operar el sistema

## Comportamiento obligatorio si la suscripción venció

Cuando la suscripción esté vencida:

* debe mostrarse un **popup obligatorio** indicando que debe abonar o renovar la suscripción
* debe usarse **SweetAlert2**
* todo el dashboard debe quedar **difuminado / blur**
* el usuario no debe poder hacer clic ni interactuar con nada
* debe bloquearse todo uso del panel hasta reactivar el plan
* deben deshabilitarse acciones, formularios, botones, selects y controles
* debe mostrarse opción visible para:

  * renovar plan
  * cambiar de plan
  * ver detalles de suscripción

## Visualización del plan en Panel Cliente

En el panel cliente debe verse claramente:

* nombre del plan suscripto
* modalidad mensual o anual
* cantidad máxima de dispositivos permitidos
* cantidad de dispositivos usados
* fecha de vencimiento
* estado de la suscripción
* CTA para renovar o cambiar plan

## Restricción por cantidad de dispositivos

El sistema debe impedir cargar más dispositivos que los permitidos por el plan:

* **Emprender:** máximo 1
* **PyME:** máximo 5
* **Bussines:** ilimitado

Si intenta superar el límite:

* mostrar SweetAlert2
* explicar que debe cambiar de plan
* no permitir guardar el nuevo dispositivo

## Administración de suscripciones

Desde el panel administrador debe poder verse:

* cliente
* plan actual
* modalidad mensual o anual
* estado
* fecha de inicio
* fecha de vencimiento
* cantidad de dispositivos usados
* límite permitido
* historial de renovaciones
* alertas por vencimiento próximo
* clientes vencidos
* clientes suspendidos

## Estados sugeridos de suscripción

* active
* expired
* suspended
* canceled
* pending_payment
* trial, si lo querés contemplar opcionalmente

---

# 5. Funcionalidades obligatorias

## 5.1 Autenticación

Implementar:

* Login
* Register
* Recuperar contraseña
* Logout
* Persistencia de sesión
* Protección de rutas
* Redirección según rol
* Manejo de sesión con Supabase Auth

---

## 5.2 Roles y permisos

El sistema debe permitir que uno o más usuarios con perfil **Admin** puedan gestionar roles y permisos.

### Debe incluir:

* crear roles
* editar roles
* eliminar roles
* asignar roles a usuarios
* asignar permisos a roles
* modificar permisos por módulo
* permisos granulares por acción

### Acciones mínimas:

* ver
* crear
* editar
* eliminar
* administrar

### Módulos mínimos:

* dashboard_admin
* usuarios
* clientes
* devices
* lugares
* sensores
* actuadores
* broker
* notificaciones
* perfil
* roles
* permisos
* suscripciones
* planes

Quiero una propuesta escalable y profesional para modelar esto en Supabase.

---

## 5.3 Dashboard Administrador

Crear un dashboard administrador moderno, responsive y bien jerarquizado.

### Secciones:

* Dashboard general
* Lista de clientes + dispositivos
* Usuarios: ABM
* Devices: ABM
* Roles y permisos
* Broker: configuración
* Suscripciones / planes
* Mi perfil
* Notificaciones

### Dashboard general debe mostrar:

* cantidad total de clientes
* cantidad de usuarios
* cantidad de dispositivos
* cantidad de dispositivos online/offline
* alertas recientes
* actividad reciente
* resumen de sensores
* resumen de actuadores
* resumen de suscripciones activas/vencidas
* métricas rápidas con tarjetas y tablas

---

## 5.4 Clientes + Dispositivos

Pantalla para visualizar:

* listado de clientes
* dispositivos asociados a cada cliente
* estado del dispositivo
* lugar asociado
* última conexión
* tipo de dispositivo
* plan suscripto
* estado de suscripción
* acciones rápidas

Debe incluir:

* búsqueda
* filtros
* paginación
* vista tabla
* acciones con iconos SVG

---

## 5.5 Usuarios: ABM

ABM completo de usuarios:

* alta
* baja
* modificación
* visualización
* activación/desactivación
* asignación de rol
* asignación de cliente
* filtros y búsqueda

---

## 5.6 Devices: ABM

ABM completo de dispositivos:

* alta
* baja
* modificación
* visualización
* asignación a cliente
* asignación a lugar
* tipo de device
* identificador único
* estado
* configuración MQTT
* asociación con ESP32
* campos técnicos necesarios

El alta de devices debe respetar siempre los límites del plan suscripto.

---

## 5.7 Roles y permisos

Pantalla exclusiva para administrar:

* listado de roles
* permisos por rol
* matriz de permisos
* asignación de permisos por módulo y acción
* relación entre usuario y rol

---

## 5.8 Broker: Configuración

Pantalla para administrar la configuración del broker.

### Valores iniciales:

* Host: `broker.emqx.io`

Protocolos:

* TCP 1883
* WebSocket 8083
* TLS 8883
* WSS 8084

Debe permitir:

* visualizar
* editar
* validar
* guardar en Supabase
* activar configuración por entorno
* definir topics base si lo proponés

---

## 5.9 Mi Perfil

Debe permitir:

* visualizar datos personales
* editar nombre
* editar email si corresponde
* cambiar avatar
* cambiar contraseña
* ver rol asignado
* ver preferencias
* guardar tema seleccionado
* ver información de acceso reciente

---

## 5.10 Panel Usuario / Cliente

Crear panel de usuario final, muy visual y usable.

### Header obligatorio

Debe incluir:

* Logo a la izquierda
* Select para Lugar
* Select para elegir Dispositivo a cargar datos
* Botón toggle horizontal para cambiar tema oscuro/claro
* iconos SVG
* ícono campana para notificaciones
* la campana debe mostrar preview al acercar el mouse o al clic
* foto de perfil
* la foto debe cambiar al hacer clic
* nombre del usuario
* ícono para agrandar pantalla
* ícono para salir
* **indicador visible del plan suscripto**

---

## 5.11 Dashboard de usuario

El usuario debe ver:

* sensores
* actuadores
* estados online/offline
* métricas
* tarjetas
* gráficas si lo considerás apropiado
* alertas
* filtros por lugar y dispositivo
* estado del plan
* fecha de vencimiento

Debe tomar como referencia el proyecto original y mejorar:

* diseño
* claridad visual
* responsive
* legibilidad
* experiencia de usuario

### Si la suscripción está vencida:

* mostrar popup SweetAlert2
* aplicar overlay oscuro o semitransparente
* aplicar blur al dashboard
* bloquear interacción completa
* mostrar CTA para pagar / renovar / cambiar plan

---

## 5.12 Mis Devices

ABM para que el usuario gestione sus dispositivos, si su rol lo permite:

* alta
* baja
* modificación
* visualización
* asociación a lugar
* configuración básica

Debe respetar siempre el límite de dispositivos del plan.

---

## 5.13 Notificaciones

Sistema interno de notificaciones:

* ícono campana
* contador de no leídas
* listado
* marcar una como leída
* marcar todas como leídas
* preview al hover o click
* persistencia en Supabase
* posibilidad de realtime

Tipos sugeridos:

* sistema
* dispositivo
* alerta
* seguridad
* usuario
* suscripción

También contemplar notificaciones automáticas por:

* plan próximo a vencer
* plan vencido
* límite de dispositivos alcanzado

---

## 5.14 PWA

La app debe ser una PWA real y bien implementada.

Incluir:

* `manifest.json`
* `service-worker.js`
* íconos
* favicon siempre
* meta tags móviles
* splash / installability
* aviso para instalar la aplicación
* manejo de `beforeinstallprompt`
* funcionamiento en desktop y mobile
* caché razonable para assets

Debe incluir:

* botón o flujo para “Instalar aplicación”
* icono de app
* experiencia mobile-friendly

---

# 6. Reglas globales UI/UX

## 6.1 Alertas

Para todas las alertas, confirmaciones, errores, warnings, éxitos y preguntas usar obligatoriamente:

* **SweetAlert2**

## 6.2 Iconos

En todos los ABM usar iconos SVG para:

* ver
* editar
* eliminar

También usar SVG para:

* tema claro/oscuro
* campana
* fullscreen
* logout
* perfil
* dispositivos
* sensores
* actuadores
* broker
* usuarios
* suscripciones
* planes

## 6.3 Estilo visual

Quiero una interfaz:

* moderna
* profesional
* tipo dashboard SaaS / industrial
* clara
* responsive
* accesible
* con excelente jerarquía visual
* con cards, tablas, filtros y formularios prolijos

## 6.4 Tema

Debe incluir:

* tema claro
* tema oscuro
* persistencia del tema
* toggle elegante en header

## 6.5 Responsive

Diseñar para:

* desktop
* tablet
* mobile

---

# 7. Integración con ESP32 DEV Kit V1

Esta parte es obligatoria y muy importante.

Quiero que el sistema quede pensado para integrarse con **ESP32 DEV Kit V1**, desarrollado en:

* **VS Code**
* **PlatformIO**
* **Framework Arduino**

## 7.1 Qué debe contemplar la solución

Debes diseñar la arquitectura completa de integración entre:

* PWA
* Supabase
* MQTT Broker
* ESP32

## 7.2 Cada ESP32 debe poder

* conectarse por WiFi
* conectarse a MQTT
* publicar telemetría
* recibir comandos
* reportar estado
* tener un `device_id` único
* estar asociado a un cliente
* estar asociado a un lugar
* enviar datos de sensores
* recibir órdenes para actuadores
* reconectarse automáticamente si pierde conexión

## 7.3 Sensores y actuadores

El diseño debe contemplar que el ESP32 puede tener:

### Sensores

* temperatura
* humedad
* entradas digitales
* entradas analógicas
* sensores futuros

### Actuadores

* relés
* leds
* salidas digitales
* PWM
* actuadores futuros

No quiero una solución rígida. Quiero una arquitectura extensible.

## 7.4 Topics MQTT

Proponer una convención profesional de topics, por ejemplo:

* estado del dispositivo
* telemetría
* comandos
* respuestas
* configuración
* heartbeat

Ejemplo:

* `app/devices/{device_id}/telemetry`
* `app/devices/{device_id}/status`
* `app/devices/{device_id}/command`
* `app/devices/{device_id}/response`

Podés proponer una mejor convención si la justificás.

## 7.5 Seguridad y autenticación de devices

Quiero que propongas cómo manejar:

* identificación del device
* credenciales MQTT
* registro de devices
* vinculación del ESP32 con la plataforma
* activación o provisioning inicial
* validación del dispositivo

## 7.6 Estado del dispositivo

Cada device debe poder reflejar:

* online
* offline
* última conexión
* último dato recibido
* calidad de conexión si querés proponerlo

## 7.7 Firmware base

Además de la arquitectura general, quiero que propongas un **firmware base ejemplo para ESP32** con:

* conexión WiFi
* conexión MQTT
* reconexión automática
* publicación periódica
* suscripción a topic de comandos
* procesamiento básico de actuadores
* estructura modular en PlatformIO

## 7.8 Estructura del proyecto PlatformIO

Proponer carpeta y organización para el firmware:

* `src`
* `include`
* `lib`
* configuración
* secretos / credenciales
* modularización

## 7.9 Comunicación con la PWA

Explicar con claridad:

* cómo la PWA visualiza datos del ESP32
* cómo el usuario envía un comando desde la PWA
* cómo ese comando llega al broker
* cómo el ESP32 lo procesa
* cómo vuelve la confirmación
* cómo se guarda histórico en Supabase

## 7.10 Persistencia

Definir qué datos deben guardarse en Supabase:

* clientes
* usuarios
* roles
* permisos
* devices
* lugares
* sensores configurados
* actuadores configurados
* eventos
* telemetría histórica si aplica
* notificaciones
* logs
* configuraciones MQTT
* planes
* suscripciones
* pagos o intentos de pago
* historial de renovaciones

---

# 8. Backend con Supabase

Quiero que propongas el backend completo usando Supabase gratuito.

## Debe incluir:

* modelo de datos
* tablas
* relaciones
* índices
* RLS
* policies
* auth
* storage para avatares o archivos
* estrategia de realtime si aplica

## Tablas sugeridas mínimas

Proponer, ampliar y ajustar como profesional, pero como mínimo contemplar:

* profiles
* users o relación con auth.users
* roles
* permissions
* role_permissions
* user_roles
* clients
* places
* devices
* device_types
* sensors
* actuators
* device_sensors
* device_actuators
* broker_configs
* notifications
* device_events
* telemetry_logs
* command_logs
* audit_logs
* subscription_plans
* client_subscriptions
* subscription_history
* billing_events o payment_events

---

# 9. Arquitectura requerida

Quiero una propuesta clara, profesional y mantenible.

## Debe separar:

### Frontend

* pages
* layouts
* components
* services
* hooks o utilidades reutilizables
* router
* guards de autenticación
* guards de permisos
* guards de suscripción
* tema
* estado global si aplica
* integración Supabase
* integración MQTT en frontend si la proponés

### Backend

* tablas
* políticas
* funciones
* storage
* triggers

### IoT

* firmware ESP32
* topics MQTT
* flujo de datos
* estrategia de comandos
* manejo de errores
* reconexión

### Billing / Suscripciones

* definición de planes
* suscripción actual
* control de vencimiento
* control de límites
* historial
* lógica de bloqueo

---

# 10. Requisitos de calidad

Quiero:

* código limpio
* reusable
* modular
* comentado cuando haga falta
* nombres claros
* validaciones
* manejo de errores
* UX cuidada
* seguridad razonable
* escalabilidad
* maintainability

---

# 11. Separación por fases

Quiero que el trabajo esté **separado estrictamente por fases**, y que se empiece por el **frontend del administrador**.

## Fase 1 — Frontend Administrador

Empezar exclusivamente por el frontend del administrador.

Debe incluir:

1. arquitectura frontend
2. estructura de carpetas
3. layout general del admin
4. login
5. registro
6. recuperar contraseña
7. dashboard admin
8. lista clientes + dispositivos
9. usuarios ABM
10. devices ABM
11. roles y permisos
12. broker configuración
13. suscripciones / planes
14. mi perfil
15. notificaciones
16. modo claro/oscuro
17. SweetAlert2
18. iconos SVG
19. favicon
20. base PWA inicial

### En esta fase quiero:

* descripción completa
* arquitectura propuesta
* flujo de navegación
* wireframes funcionales
* componentes necesarios
* páginas necesarias
* rutas
* guards de auth, permisos y suscripción
* ejemplos de UI
* tablas
* formularios
* modales
* código base sugerido
* estructura profesional del proyecto

---

## Fase 2 — Backend Supabase

Luego desarrollar:

* modelo de datos
* SQL sugerido
* autenticación
* roles y permisos
* políticas RLS
* tablas
* relaciones
* storage
* seeds iniciales
* planes y suscripciones
* validación de cantidad de dispositivos por plan
* lógica de vencimiento
* integración con frontend admin

---

## Fase 3 — Integración IoT con ESP32

Luego desarrollar:

* arquitectura ESP32 + MQTT + PWA + Supabase
* estructura PlatformIO
* firmware ejemplo
* topics MQTT
* alta/vinculación de devices
* telemetría
* control de actuadores
* sincronización de estados
* logs
* reconexión

---

## Fase 4 — Panel Usuario / Cliente

Luego desarrollar:

* header completo
* indicador de plan suscripto
* selects lugar/dispositivo
* dashboard sensores y actuadores
* mis devices
* perfil
* notificaciones
* fullscreen
* cambio de foto
* experiencia responsive
* popup por suscripción vencida
* dashboard difuminado y bloqueado si el plan venció

---

## Fase 5 — PWA + instalación + realtime + ajustes finales

Luego desarrollar:

* manifest
* service worker
* instalación
* caché
* estrategia offline básica
* notificaciones
* realtime
* hardening
* performance
* checklist producción

---

# 12. Formato exacto de respuesta que quiero

Quiero que me respondas exactamente en este orden:

1. **Resumen funcional del sistema**
2. **Arquitectura general recomendada**
3. **Arquitectura de integración PWA + Supabase + MQTT + ESP32**
4. **Modelo de datos propuesto en Supabase**
5. **Modelo de suscripciones y reglas de negocio**
6. **Mapa de roles y permisos**
7. **Convención de topics MQTT**
8. **Estructura recomendada del firmware ESP32 con PlatformIO**
9. **Fases de desarrollo**
10. **Desarrollo completo de la Fase 1: Frontend Administrador**
11. **Código base sugerido**
12. **Buenas prácticas, seguridad y escalabilidad**
13. **Siguientes pasos**

---

# 13. Reglas importantes

* No simplifiques el proyecto
* No omitas módulos
* No cambies el stack pedido
* Usar JavaScript para frontend
* Usar Supabase gratuito como backend
* Usar SweetAlert2 para todas las alertas
* Siempre incluir favicon
* En todos los ABM usar iconos SVG para ver, editar y eliminar
* Debe ser responsive
* Debe tener modo claro/oscuro
* Debe ser PWA
* Debe contemplar instalación en dispositivo
* Debe integrar ESP32 DEV Kit V1
* Debe contemplar PlatformIO + Arduino framework
* Debe proponer arquitectura MQTT realista y profesional
* Debe contemplar escalabilidad futura
* Debe incorporar sistema de suscripciones con planes y bloqueo por vencimiento
* Debe arrancar por la **Fase 1: Frontend Administrador**
* Si faltan detalles del proyecto original, asumir una solución estándar profesional y aclarar los supuestos

---

# 14. Extra importante sobre el ESP32

Además del sistema web, quiero que tengas presente que los dispositivos físicos serán **ESP32 DEV Kit V1**, programados en **VS Code con PlatformIO y framework Arduino**.

Por eso, cada decisión de arquitectura debe considerar:

* facilidad de integración real con microcontrolador
* limitaciones típicas del ESP32
* reconexión WiFi/MQTT
* estructura extensible para múltiples sensores y actuadores
* posibilidad de crecimiento futuro a varios dispositivos por cliente
* trazabilidad de comandos y estados
* asignación de cada device a un usuario, cliente y lugar

---

# 15. Extra importante sobre suscripciones

La lógica de suscripciones debe ser considerada parte central del sistema.

El sistema debe:

* impedir operar si la suscripción venció
* mostrar el plan en el panel cliente
* bloquear el alta de dispositivos por encima del límite del plan
* contemplar renovación mensual y anual
* permitir upgrade o downgrade entre planes
* contemplar alertas de vencimiento
* contemplar historial de suscripciones
* dejar preparada la arquitectura para integrar pagos más adelante

---

# 16. Entregable esperado

Quiero una propuesta completa, profesional y detallada, con foco inicial en **Fase 1: Frontend Administrador**, pero dejando preparada toda la arquitectura para:

* Supabase
* MQTT
* ESP32
* panel de usuarios
* PWA
* notificaciones
* permisos
* suscripciones
* bloqueo por vencimiento
* escalabilidad

---

## Versión compacta del prompt

Quiero que actúes como arquitecto de software senior, desarrollador full stack senior, diseñador UX/UI senior y especialista IoT. Necesito que diseñes una **PWA en JavaScript** con **Supabase gratuito** como backend, integrada con **ESP32 DEV Kit V1** programado en **VS Code + PlatformIO + framework Arduino**, usando **MQTT con broker.emqx.io**.

La app debe incluir:

* login
* register
* recuperar contraseña
* notificaciones
* instalación PWA en dispositivo
* favicon siempre
* roles y permisos administrados por admins
* dashboard administrador
* lista de clientes + dispositivos
* usuarios ABM
* devices ABM
* roles y permisos
* broker configuración
* mi perfil
* panel usuario cliente
* selects de lugar y dispositivo
* dashboard de sensores y actuadores
* mis devices
* fullscreen
* cambio de foto
* modo oscuro/claro
* iconos SVG
* SweetAlert2 para todas las alertas

Además debe incluir sistema de suscripción con estos planes:

* **Plan Emprender:** 1 dispositivo, USD 2.99 mensual o USD 29.99 anual
* **Plan PyME:** hasta 5 dispositivos, USD 14.99 mensual o USD 129.99 anual
* **Plan Bussines:** dispositivos ilimitados, USD 99.99 mensual o USD 999.99 anual

Reglas de suscripción:

* el panel cliente debe indicar el plan suscripto
* debe mostrar vencimiento y estado
* si venció, debe salir popup obligatorio
* el dashboard debe quedar difuminado y bloqueado sin posibilidad de uso
* no debe poder usar nada hasta reactivar el plan
* no debe poder agregar más dispositivos que los permitidos por el plan

Broker:

* host: broker.emqx.io
* TCP 1883
* WebSocket 8083
* TLS 8883
* WSS 8084

Además, quiero que propongas:

* arquitectura completa PWA + Supabase + MQTT + ESP32
* modelo de datos Supabase
* RLS
* roles y permisos
* modelo de suscripciones
* convención de topics MQTT
* estrategia de vinculación y autenticación de devices
* estructura de firmware ESP32 en PlatformIO
* firmware base Arduino con WiFi + MQTT + reconexión + telemetría + comandos
* flujo de datos entre la app y el ESP32

Separá todo por fases y empezá por la **Fase 1: Frontend Administrador**.

Respondé en este orden:

1. resumen funcional
2. arquitectura general
3. arquitectura PWA + Supabase + MQTT + ESP32
4. modelo de datos
5. modelo de suscripciones
6. roles y permisos
7. topics MQTT
8. estructura firmware ESP32
9. fases
10. desarrollo completo Fase 1
11. código base
12. buenas prácticas y seguridad
13. siguientes pasos

No simplifiques, no omitas módulos y asumí criterios profesionales cuando falte información.

---

También te lo puedo convertir en una versión **optimizada para Cursor**, para que te genere mejor la estructura de carpetas, componentes, SQL de Supabase y base del firmware ESP32.

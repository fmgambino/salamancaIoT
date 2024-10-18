document.addEventListener('DOMContentLoaded', function() {
    const modeToggle = document.getElementById('mode-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');

    // Verifica el estado del modo desde localStorage y aplica el tema
    if (localStorage.getItem('dark-theme') === 'enabled') {
        document.body.classList.add('dark-theme');
        modeToggle.checked = true;
    }

    // Event listener para el interruptor de modo oscuro
    modeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('dark-theme', 'enabled'); // Guarda el estado en localStorage
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('dark-theme', 'disabled'); // Guarda el estado en localStorage
        }
    });

    // Event listener para mostrar/ocultar el menú en dispositivos móviles
    menuIcon.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Código para actualizar datos de sensores y batería (simulado)
    function updateSensorData() {
        fetch('/dht22') // Hacer la solicitud al servidor ESP32 para obtener los datos del DHT22
            .then(response => response.json())
            .then(data => {
                document.getElementById('temperature').textContent = data.temperature.toFixed(2); // Mostrar Temperatura Real
                document.getElementById('humidity').textContent = data.humidity.toFixed(2); // Mostrar Humedad Real
            })
            .catch(error => {
                console.error('Error al obtener datos del sensor DHT22:', error);
            });

        // Simulación de datos de batería (ejemplo de carga)
        //simulateBattery(); // Llama a la función para simular la carga de la batería

        // Simulación de otros datos de sensores (como en tu ejemplo anterior)
        document.getElementById('air-quality-ppm').textContent = getRandomInt(100, 500); // Calidad del aire en ppm
        document.getElementById('air-quality-co2').textContent = getRandomInt(200, 1000); // CO2 en ppm
        document.getElementById('co-level').textContent = getRandomInt(10, 50); // Nivel de CO en ppm
        document.getElementById('ds18b20-temperature').textContent = getRandomInt(18, 25); // Temperatura DS18B20 aleatoria entre 18 y 25°C
    }

    // Función para simular la carga de la batería
    /* function simulateBattery() {
        const batteryLevel = getRandomInt(0, 100); // Simula un nivel de batería entre 0 y 100%
        const progressBar = document.querySelector('.progress');
        const percentageText = document.querySelector('.percentage');

        progressBar.style.width = batteryLevel + '%';
        percentageText.textContent = batteryLevel + '%';

        // Cambiar el color de la barra según el nivel de batería
        if (batteryLevel <= 15) {
            progressBar.style.backgroundColor = 'red';
        } else if (batteryLevel <= 90) {
            progressBar.style.backgroundColor = '#96ab20';
        } else {
            progressBar.style.backgroundColor = 'green';
        }
    } */

    // Simulación de actualización de datos cada 2 segundos (2000 milisegundos)
    setInterval(updateSensorData, 2000);

    // Función auxiliar para obtener un número entero aleatorio en un rango
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Llamar a la función para actualizar datos de sensores y batería al cargar la página
    updateSensorData();

    // Función para inicializar los interruptores con SweetAlert
    // Función para inicializar los interruptores con SweetAlert
    const initSwitches = () => {
        for (let i = 1; i <= 6; i++) {
            const checkbox = document.getElementById(`rele${i}`);
            checkbox.addEventListener('change', () => {
                const action = checkbox.checked ? 'activado' : 'desactivado';
                const nextState = checkbox.checked ? 'on' : 'off';
    
                Swal.fire({
                    title: `¿Estás seguro de que quieres ${checkbox.checked ? 'activar' : 'desactivar'} el dispositivo SW${i}?`,
                    text: `¡El dispositivo será ${action}!`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: `Sí, ${checkbox.checked ? 'activar' : 'desactivar'}lo!`
                }).then((result) => {
                    if (result.isConfirmed) {
                        toggleRelay(i, nextState);
                        // Actualizar el ícono según el nuevo estado
                        const lampIcon = document.getElementById(`lamp-icon-${i}`);
                        if (lampIcon) {
                            lampIcon.style.color = checkbox.checked ? '#08a25a' : 'red';
                        }
                        Swal.fire({
                            title: "Cambiado!",
                            text: `El dispositivo SW${i} ha sido ${action}.`,
                            icon: "success"
                        });
                        } else {
                             // Si se cancela, revertir el cambio en el checkbox
                        checkbox.checked = !checkbox.checked;
                        console.error('Respuesta inesperada:', data);
                        }
                    });
                });
            }
        };

    // Llamada para inicializar los interruptores
    initSwitches();

    // Función para enviar una solicitud para controlar un relé
    function toggleRelay(relayId, state) {
        fetch(`/relay?relay=${relayId}&state=${state}`)
            .then(response => response.json())
            .then(data => {
                console.log(`Relé ${relayId} ${state}`);
            })
            .catch(error => {
                console.error('Error al cambiar el estado del relé:', error);
            });
    }
});

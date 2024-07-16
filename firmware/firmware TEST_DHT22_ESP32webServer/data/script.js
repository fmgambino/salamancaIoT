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
                // Puedes manejar el error aquí si es necesario
            });

        // Simulación de datos de batería (ejemplo de carga)
        simulateBattery(); // Llama a la función para simular la carga de la batería

        // Simulación de otros datos de sensores (como en tu ejemplo anterior)
        document.getElementById('air-quality-ppm').textContent = getRandomInt(100, 500); // Calidad del aire en ppm
        document.getElementById('air-quality-co2').textContent = getRandomInt(200, 1000); // CO2 en ppm
        document.getElementById('co-level').textContent = getRandomInt(10, 50); // Nivel de CO en ppm
        document.getElementById('ds18b20-temperature').textContent = getRandomInt(18, 25); // Temperatura DS18B20 aleatoria entre 18 y 25°C
    }

    // Función para simular la carga de la batería
    function simulateBattery() {
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
    }

    // Simulación de actualización de datos cada 2 segundos (2000 milisegundos)
    setInterval(updateSensorData, 2000);

    // Función auxiliar para obtener un número entero aleatorio en un rango
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Llamar a la función para actualizar datos de sensores y batería al cargar la página
    updateSensorData();
});

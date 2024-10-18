document.addEventListener('DOMContentLoaded', () => {
    const resetLogIcon = document.getElementById('resetLogIcon');
    const resetLogPopup = document.getElementById('resetLogPopup');
    const closePopup = document.getElementById('closePopup');
    const resetLogContent = document.getElementById('resetLogContent');

    const modeToggle = document.getElementById('mode-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');
    const body = document.body;
    const logo = document.getElementById('logo');
    const lightLogo = 'https://i.ibb.co/SQk5kwP/Smart-PDU-light-Logo.png';
    const darkLogo = 'https://i.ibb.co/xJ6Y17w/Smart-PDU-Dark-Logo.png';

console.log('resetLogIcon:', resetLogIcon);
console.log('resetLogPopup:', resetLogPopup);
console.log('resetLogContent:', resetLogContent);


    // Función para aplicar el tema
    const applyTheme = (isDark) => {
        if (isDark) {
            body.classList.add('dark-theme');
            logo.src = darkLogo;
            localStorage.setItem('dark-theme', 'enabled');
        } else {
            body.classList.remove('dark-theme');
            logo.src = lightLogo;
            localStorage.setItem('dark-theme', 'disabled');
        }
    };

    // Verifica y aplica el tema desde localStorage
    applyTheme(localStorage.getItem('dark-theme') === 'enabled');
    modeToggle.checked = localStorage.getItem('dark-theme') === 'enabled';

    // Event listener para el interruptor de modo oscuro
    modeToggle.addEventListener('change', () => {
        applyTheme(modeToggle.checked);
    });

    // Event listener para el menú desplegable
    menuIcon.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // Función para mostrar el pop-up
    const showPopup = () => {
        if (!resetLogPopup || !resetLogContent) {
            console.error('Elemento "resetLogPopup" o "resetLogContent" no encontrado.');
            return;
        }
    
        resetLogPopup.classList.remove('hidden');
    
        fetch('/resetLog')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                return response.text();
            })
            .then(data => {
                resetLogContent.innerHTML = `<pre>${data}</pre>`;
            })
            .catch(error => {
                resetLogContent.innerHTML = 'Error al cargar el registro.';
                console.error('Error al obtener el registro de reinicios:', error);
            });
    };

    // Función para ocultar el pop-up
    const hidePopup = () => {
        resetLogPopup.classList.add('hidden');
    };

    // Mostrar el pop-up al hacer clic en el ícono de información
    resetLogIcon.addEventListener('click', showPopup);

    // Cerrar el pop-up al hacer clic en la "X"
    closePopup.addEventListener('click', hidePopup);

    // Cerrar el pop-up al hacer clic fuera del contenido
    resetLogPopup.addEventListener('click', (event) => {
        if (event.target === resetLogPopup) {
            hidePopup();
        }
    });
    
    // Función para enviar una solicitud para controlar un relé
    const toggleRelay = (relayId, state) => {
        fetch(`/relay?relay=${relayId}&state=${state}`)
            .then(response => response.json())
            .then(data => {
                console.log(`Relé ${relayId} ${state}`);
            })
            .catch(error => {
                console.error('Error al cambiar el estado del relé:', error);
            });
    };

    // Función para inicializar los interruptores
    const initSwitches = () => {
        for (let i = 1; i <= 6; i++) {
            const checkbox = document.getElementById(`rele${i}`);
            checkbox.addEventListener('change', () => {
                toggleRelay(i, checkbox.checked ? 'on' : 'off');
            });
        }
    };

    // Función para actualizar los estados de los interruptores
    const updateRelayStatuses = () => {
        fetch('/relay-status')
            .then(response => response.json())
            .then(data => {
                for (let i = 1; i <= 6; i++) {
                    const checkbox = document.getElementById(`rele${i}`);
                    checkbox.checked = data[`relay${i}`] === 'ON';
                }
            })
            .catch(error => console.error('Error al obtener el estado de los relés:', error));
    };

    // Función para actualizar los datos del PDU
    const updatePDUData = () => {
        fetch('/pdu')
            .then(response => response.json())
            .then(data => {
                document.getElementById('device').textContent = data['device'];
                document.getElementById('id-serie-pdu').textContent = data['id-serie-pdu'];
            })
            .catch(error => console.error('Error al obtener datos del PDU:', error));
    };

    // Función para actualizar los datos de sensores
    const updateSensorData = () => {
        const endpoints = [
            { url: '/battery', callback: data => {
                document.querySelector('.percentage').textContent = `${data.battery}%`;
                document.querySelector('#carga .progress').style.width = `${data.battery}%`;
            }},
            { url: '/dht22', callback: data => {
                document.getElementById('temperature').textContent = data.temperature.toFixed(1);
                document.getElementById('humidity').textContent = data.humidity.toFixed(1);
            }},
            { url: '/network', callback: data => {
                document.getElementById('ip-ap').textContent = data['ip-ap'];
                document.getElementById('ssid-wifi').textContent = data['ssid-wifi'];
                document.getElementById('wifi-signal').textContent = data['wifi-signal'];
            }},
            { url: '/ip', callback: data => {
                document.getElementById('ip-webserver').textContent = data['ip-webserver'];
            }},
            {
                url: '/electroMeter',
                callback: data => {
                    document.getElementById('current').textContent = data.corrienteAC.toFixed(2) + ' A';
                    document.getElementById('voltage').textContent = data.voltajeAC.toFixed(2) + ' V';
                    document.getElementById('apparent-power').textContent = data.potenciaAparente.toFixed(2) + ' VA';
                    document.getElementById('active-power').textContent = data.potenciaActiva.toFixed(2) + ' W';
                    document.getElementById('energy-consumption').textContent = data.consumoEnergia.toFixed(2) + ' kWh';
                    document.getElementById('frequency').textContent = data.frecuenciaAC.toFixed(2) + ' Hz';
                    document.getElementById('power-factor').textContent = data.factorPotencia.toFixed(2);
                }
            },
            
            { url: '/consumo', callback: data => {
                for (let i = 1; i <= 6; i++) {
                    document.getElementById(`kw-horas${i}`).textContent = data[`consumo${i}`];
                }
            }},
        ];

        endpoints.forEach(endpoint => {
            fetch(endpoint.url)
                .then(response => response.json())
                .then(data => endpoint.callback(data))
                .catch(error => console.error(`Error al obtener datos de ${endpoint.url}:`, error));
        });
    };

    // Función para actualizar el número de reinicios
    const updateResetCount = () => {
        fetch('/resetCountPDU')
             .then(response => {
            if (!response.ok) {
                throw new Error('Red no válida');
            }
            return response.json();
         })
        .then(data => {
            // Asegúrate de que data.restart_count sea un valor válido
            const restartCount = data.restart_count || '0';
            document.getElementById('resetCount').textContent = restartCount;
            console.log("Número de reinicios:", restartCount);
        })
        .catch(error => console.error('Error al obtener el número de reinicios:', error));
    };


    // Inicializar los interruptores
    initSwitches();

    // Inicializar los datos de sensores y contador de reinicios al cargar la página
    updatePDUData();
    updateSensorData();
    updateResetCount();    

     // Actualizar los estados de los interruptores, datos de sensores y contador de reinicios periódicamente
    setInterval(updateRelayStatuses, 500);
    setInterval(updateSensorData, 2500);
    setInterval(updateResetCount, 2000); // Actualiza cada 2 segundos
});

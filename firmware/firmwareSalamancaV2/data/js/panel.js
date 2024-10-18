document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    const sidebar = body.querySelector('nav');
    const toggle = body.querySelector(".toggle");
    const searchBtn = body.querySelector(".search-box");
    const modeSwitch = body.querySelector(".toggle-switch");
    const modeText = body.querySelector(".mode-text");
    const resetLogIcon = document.getElementById('resetLogIcon');
    const resetLogPopup = document.getElementById('resetLogPopup');
    const closePopup = document.getElementById('closePopup');
    const resetLogContent = document.getElementById('resetLogContent');

    // Verifica y aplica el tema desde localStorage
    const applyTheme = (isDark) => {
        body.classList.toggle('dark', isDark);
        modeText.innerText = isDark ? "Light mode" : "Dark mode";
    };

    applyTheme(localStorage.getItem('dark-theme') === 'enabled');
    modeSwitch.checked = localStorage.getItem('dark-theme') === 'enabled';

    // Event listener para el interruptor de modo oscuro
    modeSwitch.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark');
        localStorage.setItem('dark-theme', isDarkMode ? 'enabled' : 'disabled');
        modeText.innerText = isDarkMode ? "Light mode" : "Dark mode";
    });

    // Toggle sidebar visibility
    toggle.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

    // Show sidebar on search button click
    searchBtn.addEventListener("click", () => {
        sidebar.classList.remove("close");
    });

    // Show reset log popup
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
                resetLogContent.innerHTML = 'Felicidades, No se encontraron reinicios.';
                console.error('Error al obtener el registro de reinicios:', error);
            });
    };

    // Hide reset log popup
    const hidePopup = () => {
        resetLogPopup.classList.add('hidden');
    };

    // Mostrar el pop-up al hacer clic en el ícono de información
    resetLogIcon.addEventListener('click', showPopup);

    // Cerrar el pop-up al hacer clic en la "X" o fuera del contenido
    closePopup.addEventListener('click', hidePopup);
    resetLogPopup.addEventListener('click', (event) => {
        if (event.target === resetLogPopup) {
            hidePopup();
        }
    });

    const updateRelayStatuses = () => {
        fetch('/relay-status')
            .then(response => response.json())
            .then(data => {
                for (let i = 1; i <= 6; i++) {
                    const checkbox = document.getElementById(`rele${i}`);
                    const lampIcon = document.getElementById(`lamp-icon-${i}`);
                    if (checkbox && lampIcon) {
                        checkbox.checked = data[`relay${i}`] === 'OFF';
                        // Actualizar el ícono basado en el estado del checkbox
                        if (checkbox.checked) {
                            lampIcon.style.color = '#08a25a'; // Cambiar a verde si está activado
                        } else {
                            lampIcon.style.color = 'red'; // Cambiar a rojo si está desactivado
                        }
                    }
                }
            })
            .catch(error => console.error('Error al obtener el estado de los relés:', error));
    };

    // Llamar a la función para actualizar el estado de los relés al cargar la página
    updateRelayStatuses();

    // Función para enviar una solicitud para activar todos los relés
    const activateAllRelays = () => {
        for (let i = 1; i <= 6; i++) {
            fetch(`/relay?relay=${i}&state=on`)
                .then(response => response.text())
                .then(data => {
                    console.log(`Relé ${i} activado`);
                })
                .catch(error => {
                    console.error(`Error al activar el relé ${i}:`, error);
                });
        }
    }; 

    // Activar todos los relés al cargar la página*/
    //activateAllRelays(); 

    // Actualizar el estado de los relés periódicamente
    setInterval(updateRelayStatuses, 200); // Actualizar cada 5 segundos

    // Función para enviar una solicitud para controlar un dispositivo
    const toggleRelay = (relayId, state) => {
        fetch(`/relay?relay=${relayId}&state=${state}`)
            .then(response => response.text())
            .then(data => {
                console.log(`Respuesta del servidor: ${data}`);
                if (data === "OK") {
                    console.log(`Dispositivo ${relayId} ${state}`);
                } else {
                    console.error('Respuesta inesperada:', data);
                }
            })
            .catch(error => {
                console.error('Error al cambiar el estado del dispositivo:', error);
            });
    };

    // Función para inicializar los interruptores con SweetAlert
    const initSwitches = () => {
    for (let i = 1; i <= 6; i++) {
        const checkbox = document.getElementById(`rele${i}`);
        checkbox.addEventListener('change', () => {
            const action = checkbox.checked ? 'activado' : 'desactivado';
            const nextState = checkbox.checked ? 'on' : 'off';

            Swal.fire({
                title: `¿Estás seguro de que quieres ${checkbox.checked ? 'activar' : 'desactivar'} el dispositivo?`,
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
                        text: `El dispositivo ${i} ha sido ${action}.`,
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

// Función para actualizar los nombres de los dispositivos
const updateRelayNames = () => {
    fetch('/relay-names')
        .then(response => response.json())
        .then(data => {
            for (let i = 1; i <= 6; i++) {
                const deviceNameElement = document.getElementById(`device-name-${i}`);
                if (deviceNameElement && data[`device${i}`]) {
                    deviceNameElement.innerHTML = `${data[`device${i}`]} <i class="fas fa-edit edit-icon" onclick="editName('${i}')"></i>`;
                }
            }
        })
        .catch(error => console.error('Error al obtener los nombres de los dispositivos:', error));
};

// Llamar a la función para actualizar los nombres de los dispositivos al cargar la página
updateRelayNames();



    // Función para actualizar los datos del PDU
    const updatePDUData = () => {
        fetch('/pdu')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Convertir la respuesta a JSON
            })
            .then(data => {
                console.log('Datos de PDU:', data); // Mostrar los datos en la consola

                // Ejemplo de cómo podrías mostrar los datos en el DOM:
                document.getElementById('device').textContent = data.device;
                document.getElementById('id-serie-pdu').textContent = data['id-serie-pdu'];
            })
            .catch(error => {
                console.error('Error al obtener datos de PDU:', error);
            });
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
            const restartCount = data.restart_count || '0';
            document.getElementById('resetCount').textContent = restartCount;
            console.log("Número de reinicios:", restartCount);
        })
        .catch(error => console.error('Error al obtener el número de reinicios:', error));
    };

    // Inicializar los datos de sensores y contador de reinicios al cargar la página
    updatePDUData();
    updateSensorData();
    updateResetCount();
    updateRelayStatuses();    

    // Actualizar los estados de los interruptores, datos de sensores y contador de reinicios periódicamente
    
    setInterval(updateRelayStatuses, 200); // Actualizar cada 5 segundos  el estado de los relés periódicamente
    setInterval(updateRelayNames, 100); // Actualizar cada 5 segundos los nombres de los dispositivos periódicamente
    
    setInterval(updateSensorData, 2500);
    setInterval(updateResetCount, 2000); // Actualiza cada 2 segundos
});

document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');

    // Verificar el tema almacenado en localStorage
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        themeSwitch.checked = true;
    } else {
        document.body.classList.add('light');
    }

    // Cambiar el tema
    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });

    // Guardar configuración de Servo 1
    document.getElementById('save-settings-servo1').addEventListener('click', () => {
        const mode = document.getElementById('mode-servo1').checked ? 'Activado' : 'Desactivado';
        const tempMax = document.getElementById('temp-max-servo1').value;
        const tempMin = document.getElementById('temp-min-servo1').value;
        const speed = document.getElementById('speed-servo1').value;

        const status = `Servo 1 - Modo: ${mode}, Temp. Máx: ${tempMax}°C, Temp. Mín: ${tempMin}°C, Velocidad: ${speed}°`;
        document.getElementById('servo1-status').value = status;
    });

    // Guardar configuración de Servo 2
    document.getElementById('save-settings-servo2').addEventListener('click', () => {
        const mode = document.getElementById('mode-servo2').checked ? 'Activado' : 'Desactivado';
        const tempMax = document.getElementById('temp-max-servo2').value;
        const tempMin = document.getElementById('temp-min-servo2').value;
        const speed = document.getElementById('speed-servo2').value;

        const status = `Servo 2 - Modo: ${mode}, Temp. Máx: ${tempMax}°C, Temp. Mín: ${tempMin}°C, Velocidad: ${speed}°`;
        document.getElementById('servo2-status').value = status;
    });
});

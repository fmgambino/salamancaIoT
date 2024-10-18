document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    let inactivityTimeout;

    // Función para manejar el inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');

            console.log(`Intento de inicio de sesión: Usuario: ${username}, Contraseña: ${password}`);

            if (username === 'admin' && password === 'admin') {
                console.log('Inicio de sesión exitoso');
                localStorage.setItem('authenticated', 'true');
                window.location.href = '/index.html';
            } else {
                console.log('Inicio de sesión fallido');
                alert('Inicio de sesión fallido: Usuario o contraseña incorrectos');
            }
        });
    }

    // Función para manejar el registro de usuario
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const formData = new FormData(signupForm);
            const username = formData.get('username');
            const password = formData.get('password');

            console.log(`Registro de usuario: Usuario: ${username}, Contraseña: ${password}`);

            alert('Registro exitoso!');
        });
    }

    // Manejo de inactividad y autenticación en index.html
    if (window.location.pathname === '/index.html') {
        // Verificar si el usuario está autenticado
        const isAuthenticated = localStorage.getItem('authenticated');
        if (!isAuthenticated) {
            window.location.href = '/login';
        } else {
            // Manejo de inactividad
            function resetInactivityTimeout() {
                clearTimeout(inactivityTimeout);
                inactivityTimeout = setTimeout(() => {
                    alert('Sesión expirada por inactividad.');
                    localStorage.removeItem('authenticated');
                    window.location.href = '/login';
                }, 5 * 60 * 1000); // 10 segundos
            }

            // Resetea el temporizador de inactividad en cualquier evento de interacción
            document.addEventListener('mousemove', resetInactivityTimeout);
            document.addEventListener('keypress', resetInactivityTimeout);
            document.addEventListener('click', resetInactivityTimeout);

            resetInactivityTimeout();
        }

        // Manejo del botón de logout en index.html
        const logoutButton = document.querySelector('.bottom-content li a');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('authenticated');
                window.location.href = '/login';
            });
        }
    }

    // Funcionalidad del toggle para cambiar entre formularios
    const buttons = [registerBtn, loginBtn];

    if (buttons) {
        buttons.forEach(button => {
            button.onclick = function() {
                const action = this.id === 'register' ? 'add' : 'remove';
                container.classList[action]('active');
            };
        });
    }
});

import { signUp } from '../assets/js/auth.js';
import { success, error } from '../assets/js/alerts.js';
export async function renderRegisterView() {
  setTimeout(bindRegisterEvents, 0);
  return `
    <section class="auth-shell">
      <div class="auth-card">
        <h1 class="auth-title">Crear cuenta</h1>
        <p class="auth-subtitle">Registro del primer administrador o nuevo operador.</p>
        <form id="register-form" class="form-grid">
          <div class="form-row"><label>Nombre completo</label><input class="input" type="text" name="full_name" required></div>
          <div class="form-row"><label>Email</label><input class="input" type="email" name="email" autocomplete="email" required></div>
          <div class="form-row"><label>Contraseña</label><input class="input" type="password" name="password" autocomplete="new-password" required minlength="8"></div>
          <button class="btn btn-primary" type="submit">Registrarme</button>
        </form>
        <div class="auth-links"><a href="#/login">Volver al login</a></div>
      </div>
    </section>
  `;
}
function bindRegisterEvents() {
  const form = document.getElementById('register-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      await signUp(data.get('email'), data.get('password'), { full_name: data.get('full_name') });
      await success('Cuenta creada. Revisá tu email o usá el alta manual en Supabase si tu proyecto aún está en configuración.');
      location.hash = '/login';
    } catch (err) {
      console.error(err);
      error(err.message || 'No se pudo registrar el usuario.');
    }
  });
}

import { resetPassword } from '../assets/js/auth.js';
import { success, error } from '../assets/js/alerts.js';
export async function renderForgotPasswordView() {
  setTimeout(bindForgotEvents, 0);
  return `
    <section class="auth-shell">
      <div class="auth-card">
        <h1 class="auth-title">Recuperar contraseña</h1>
        <p class="auth-subtitle">Te enviaremos un enlace de recuperación.</p>
        <form id="forgot-form" class="form-grid">
          <div class="form-row"><label>Email</label><input class="input" type="email" name="email" autocomplete="email" required></div>
          <button class="btn btn-primary" type="submit">Enviar enlace</button>
        </form>
        <div class="auth-links"><a href="#/login">Volver al login</a></div>
      </div>
    </section>
  `;
}
function bindForgotEvents() {
  const form = document.getElementById('forgot-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try { await resetPassword(data.get('email')); await success('Email enviado.'); location.hash = '/login'; }
    catch (err) { error(err.message || 'No se pudo enviar el email.'); }
  });
}

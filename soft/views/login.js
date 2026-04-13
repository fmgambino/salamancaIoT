import { signIn } from '../assets/js/auth.js';
import { success, error } from '../assets/js/alerts.js';
export async function renderLoginView() {
  setTimeout(bindLoginEvents, 0);
  return `
    <section class="auth-shell">
      <div class="auth-card">
        <div class="logo-inline"><span class="brand-mark" style="width:52px;height:52px">✓</span><div><strong>MedTuCIoT</strong><div class="muted">Acceso seguro al panel</div></div></div>
        <h1 class="auth-title text-gradient">Iniciar sesión</h1>
        <p class="auth-subtitle">Un panel más limpio, rápido y listo para producción.</p>
        <form id="login-form" class="form-grid">
          <div class="form-row"><label>Email</label><input class="input" type="email" name="email" autocomplete="email" required placeholder="fmgambino@admin.com"></div>
          <div class="form-row"><label>Contraseña</label><input class="input" type="password" name="password" autocomplete="current-password" required placeholder="••••••••"></div>
          <button class="btn btn-primary" type="submit">Entrar al panel</button>
        </form>
        <div class="auth-links"><a href="#/forgot-password">Olvidé mi contraseña</a><a href="#/register">Crear cuenta</a></div>
      </div>
    </section>
  `;
}
function bindLoginEvents() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      await signIn(data.get('email'), data.get('password'));
      await success('Sesión iniciada correctamente.');
      location.hash = '/admin/dashboard';
    } catch (err) {
      console.error(err);
      error(err.message || 'No se pudo iniciar sesión.');
    }
  });
}

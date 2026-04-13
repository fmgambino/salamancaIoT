import { initTheme, toggleTheme } from './theme.js';
import { getSession, signOut } from './auth.js';
import { registerServiceWorker } from './pwa.js';
import { renderRoute, navigate } from './router.js';
import { qs, qsa } from './utils.js';
import { confirmAction, success } from './alerts.js';
import { state, persistUI } from './state.js';

const app = document.getElementById('app');

async function bootstrap() {
  initTheme();
  registerServiceWorker();
  try { await getSession(); } catch (err) { console.error(err); }
  await renderRoute(app);
}

window.addEventListener('hashchange', () => renderRoute(app));
window.addEventListener('DOMContentLoaded', bootstrap);

document.addEventListener('click', async (event) => {
  const navBtn = event.target.closest('[data-nav]');
  if (navBtn) navigate(navBtn.dataset.nav);

  const themeBtn = event.target.closest('[data-action="toggle-theme"]');
  if (themeBtn) toggleTheme();

  const sidebarToggle = event.target.closest('[data-action="toggle-sidebar"]');
  if (sidebarToggle) {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    persistUI();
    document.querySelector('.app-shell')?.classList.toggle('collapsed', state.sidebarCollapsed);
    document.querySelector('.sidebar')?.classList.toggle('collapsed', state.sidebarCollapsed);
  }

  const profileBtn = event.target.closest('[data-action="open-avatar-picker"]');
  if (profileBtn) qs('#avatar-input')?.click();

  const logoutBtn = event.target.closest('[data-action="logout"]');
  if (logoutBtn) {
    const ok = await confirmAction('¿Querés cerrar sesión?');
    if (ok.isConfirmed) { await signOut(); navigate('/login'); }
  }

  const markAllBtn = event.target.closest('[data-action="mark-notifications-read"]');
  if (markAllBtn) {
    state.notifications = state.notifications.map(n => ({ ...n, read: true }));
    persistUI();
    await success('Notificaciones marcadas como leídas.');
    renderRoute(app);
  }

  const toggleActuator = event.target.closest('[data-action="toggle-actuator"]');
  if (toggleActuator) {
    const id = toggleActuator.dataset.id;
    const item = state.actuators.find(a => a.id === id);
    if (item) item.active = !item.active;
    persistUI();
    renderRoute(app);
  }
});

document.addEventListener('change', async (event) => {
  if (event.target.matches('#avatar-input')) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.avatar = reader.result;
      persistUI();
      renderRoute(app);
    };
    reader.readAsDataURL(file);
  }
  if (event.target.matches('#place-select')) {
    state.selectedPlaceId = event.target.value;
    const firstDevice = state.devicesByPlace[state.selectedPlaceId]?.[0];
    state.selectedDeviceId = firstDevice?.id || '';
    persistUI();
    renderRoute(app);
  }
  if (event.target.matches('#device-select')) {
    state.selectedDeviceId = event.target.value;
    persistUI();
  }
});

document.addEventListener('submit', async (event) => {
  const notificationForm = event.target.closest('#notification-form');
  if (notificationForm) {
    event.preventDefault();
    const fd = new FormData(notificationForm);
    const recipients = fd.getAll('recipients');
    const scope = fd.get('scope');
    const targetLabel = scope === 'all' ? 'Todos los clientes' : scope === 'one' ? recipients[0] || 'Cliente' : `${recipients.length} clientes`;
    state.notifications.unshift({
      id: `n${Date.now()}`,
      title: fd.get('title'),
      message: fd.get('message'),
      date: new Date().toLocaleString('es-AR'),
      read: false,
      target: targetLabel
    });
    state.notificationDrafts.push({ title: fd.get('title'), scope, recipients });
    persistUI();
    await success('Notificación preparada y guardada.');
    renderRoute(app);
  }
});

document.addEventListener('view:rendered', () => {
  const route = location.hash.replace(/^#/, '') || '/login';
  qsa('.sidebar-link').forEach((el) => el.classList.toggle('active', el.getAttribute('href') === `#${route}`));
  document.querySelector('.app-shell')?.classList.toggle('collapsed', state.sidebarCollapsed);
  document.querySelector('.sidebar')?.classList.toggle('collapsed', state.sidebarCollapsed);
  if (window.lucide) window.lucide.createIcons();
});

import { renderLoginView } from '../../views/login.js';
import { renderRegisterView } from '../../views/register.js';
import { renderForgotPasswordView } from '../../views/forgot-password.js';
import { renderAdminDashboardView } from '../../views/admin-dashboard.js';
import { renderDevicesView } from '../../views/devices.js';
import { renderNotificationsView } from '../../views/notifications.js';
import { renderProfileView } from '../../views/profile.js';
import { renderClientDashboardView } from '../../views/client-dashboard.js';
import { renderClientsView } from '../../views/clients.js';
import { renderNotFoundView } from '../../views/not-found.js';
import { renderUnauthorizedView } from '../../views/unauthorized.js';
import { requireAuth } from './guards.js';

const routes = {
  '/login': { render: renderLoginView, public: true },
  '/register': { render: renderRegisterView, public: true },
  '/forgot-password': { render: renderForgotPasswordView, public: true },
  '/admin/dashboard': { render: renderAdminDashboardView },
  '/admin/clients': { render: renderClientsView },
  '/admin/devices': { render: renderDevicesView },
  '/admin/notificaciones': { render: renderNotificationsView },
  '/admin/perfil': { render: renderProfileView },
  '/cliente/dashboard': { render: renderClientDashboardView },
  '/unauthorized': { render: renderUnauthorizedView, public: true }
};

export function getCurrentRoute() {
  const hash = location.hash.replace(/^#/, '');
  return hash || '/login';
}
export function navigate(path) { location.hash = path; }
export async function renderRoute(appRoot) {
  const current = getCurrentRoute();
  const route = routes[current];
  if (!route) { appRoot.innerHTML = renderNotFoundView(); return; }
  if (!requireAuth(current)) { navigate('/login'); return; }
  const html = await route.render();
  appRoot.innerHTML = html;
  document.dispatchEvent(new CustomEvent('view:rendered', { detail: { route: current } }));
}

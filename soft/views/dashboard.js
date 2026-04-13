import { renderAdminLayout } from "./layout.js";
import { dashboardStats, notifications, subscriptions } from "../data/mocks.js";

export async function renderDashboardView() {
  const stats = dashboardStats.map(item => `
    <article class="card stat-card">
      <h3>${item.label}</h3>
      <p class="stat-value">${item.value}</p>
    </article>
  `).join("");

  const content = `
    <section class="content-stack">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard Administrador</h1>
          <p class="page-subtitle">Resumen general de clientes, devices, alertas y suscripciones.</p>
        </div>
      </div>

      <section class="stat-grid">${stats}</section>

      <section class="panel-grid">
        <article class="panel">
          <h2>Alertas recientes</h2>
          <ul class="list-clean">
            ${notifications.map(n => `<li class="notification-item"><strong>${n.type}</strong><br><span class="muted">${n.message}</span></li>`).join("")}
          </ul>
        </article>

        <article class="panel">
          <h2>Próximos vencimientos</h2>
          <ul class="list-clean">
            ${subscriptions.map(s => `<li class="kv"><span>${s.client}</span><strong>${s.endDate}</strong></li>`).join("")}
          </ul>
        </article>
      </section>
    </section>
  `;
  return renderAdminLayout("Dashboard", content);
}

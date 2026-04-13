import { renderAppLayout } from './layout.js';
import { renderTable } from '../components/table.js';
import { state } from '../assets/js/state.js';
import { statusBadge } from '../components/badges.js';
import { createIcon } from '../assets/js/utils.js';
export async function renderClientsView() {
  const content = `
    <div class="content-stack">
      <div class="page-header">
        <div><h1 class="page-title">Clientes</h1><p class="page-subtitle">Administrá la cartera, el plan activo y el estado de operación.</p></div>
        <div class="toolbar"><button class="btn btn-primary">${createIcon('plus', 16)} Nuevo cliente</button></div>
      </div>
      ${renderTable({
        title: 'Listado de clientes',
        columns: [
          { key: 'name', label: 'Cliente' },
          { key: 'plan', label: 'Plan' },
          { key: 'devices', label: 'Devices' },
          { key: 'status', label: 'Estado', render: row => statusBadge(row.status) }
        ],
        rows: state.clients,
        actions: [
          { label: 'Ver', icon: createIcon('eye', 16) },
          { label: 'Editar', icon: createIcon('pencil', 16) },
          { label: 'Avisar', icon: createIcon('bell-ring', 16) }
        ],
        toolbar: `<input class="input search-input" placeholder="Buscar cliente..."><button class="btn">${createIcon('filter', 16)} Filtrar</button>`
      })}
    </div>`;
  return renderAppLayout({ title: 'Clientes', content, route: '/admin/clients', mode: 'admin' });
}

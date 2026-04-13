import { renderAppLayout } from './layout.js';
import { renderTable } from '../components/table.js';
import { state } from '../assets/js/state.js';
import { statusBadge } from '../components/badges.js';
import { createIcon } from '../assets/js/utils.js';
export async function renderDevicesView() {
  const content = `
    <div class="content-stack">
      <div class="page-header">
        <div><h1 class="page-title">Devices</h1><p class="page-subtitle">Vista técnica con estado, ubicación y última actividad.</p></div>
        <div class="toolbar"><button class="btn btn-primary">${createIcon('plus', 16)} Añadir dispositivo</button></div>
      </div>
      ${renderTable({
        title: 'Inventario de devices',
        columns: [
          { key: 'name', label: 'Nombre' },
          { key: 'identifier', label: 'ID' },
          { key: 'client', label: 'Cliente' },
          { key: 'place', label: 'Lugar' },
          { key: 'status', label: 'Estado', render: row => statusBadge(row.status) },
          { key: 'lastSeen', label: 'Última actividad' }
        ],
        rows: state.devicesAdmin,
        actions: [
          { label: 'Info', icon: createIcon('info', 16) },
          { label: 'Editar', icon: createIcon('pencil', 16) },
          { label: 'Eliminar', icon: createIcon('trash-2', 16) }
        ],
        toolbar: `<input class="input search-input" placeholder="Buscar device..."><button class="btn">${createIcon('refresh-cw', 16)} Refrescar</button>`
      })}
    </div>`;
  return renderAppLayout({ title: 'Devices', content, route: '/admin/devices', mode: 'admin' });
}

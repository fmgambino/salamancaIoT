export function renderTable({ title, columns, rows, actions = [], toolbar = '' }) {
  return `
    <section class="table-card">
      <div class="table-toolbar">
        <div class="page-header">
          <div><h2 class="section-title">${title}</h2></div>
          <div class="toolbar">${toolbar}</div>
        </div>
      </div>
      <div class="table-wrap">
        <table class="app-table">
          <thead>
            <tr>
              ${columns.map(c => `<th>${c.label}</th>`).join('')}
              ${actions.length ? '<th>Acciones</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                ${columns.map(c => `<td>${typeof c.render === 'function' ? c.render(row) : row[c.key] ?? '-'}</td>`).join('')}
                ${actions.length ? `<td><div class="table-actions">${actions.map(a => `<button class="btn icon-btn" title="${a.label}">${a.icon}</button>`).join('')}</div></td>` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="table-footer"><span class="muted">Mostrando ${rows.length} registros</span><div class="toolbar"><button class="btn">Anterior</button><button class="btn">Siguiente</button></div></div>
    </section>
  `;
}

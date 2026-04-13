import { renderSidebar } from '../components/sidebar.js';
import { renderHeader } from '../components/header.js';
export function renderAppLayout({ title, content, route, mode = 'admin' }) {
  return `
    <div class="app-shell">
      ${renderSidebar(route)}
      <div class="main-shell">
        ${renderHeader(title, mode)}
        <main class="app-content">${content}</main>
      </div>
    </div>
  `;
}

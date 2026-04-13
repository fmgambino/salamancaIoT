import { state, persistUI } from './state.js';
export function initTheme() { setTheme(state.theme || 'dark'); }
export function setTheme(theme) { state.theme = theme; document.documentElement.setAttribute('data-theme', theme); persistUI(); }
export function toggleTheme() { setTheme(state.theme === 'dark' ? 'light' : 'dark'); }

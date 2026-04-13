import { badgeClass } from '../assets/js/utils.js';
export function statusBadge(status) { return `<span class="badge ${badgeClass(status)}">${status}</span>`; }

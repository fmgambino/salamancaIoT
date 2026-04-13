import { isAuthenticated } from './auth.js';
const publicRoutes = new Set(['/login', '/register', '/forgot-password']);
export function requireAuth(route) { return publicRoutes.has(route) ? true : isAuthenticated(); }

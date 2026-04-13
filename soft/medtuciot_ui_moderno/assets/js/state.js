const stored = JSON.parse(localStorage.getItem('medtuciot-ui') || '{}');
export const state = {
  session: null,
  theme: stored.theme || 'dark',
  sidebarCollapsed: stored.sidebarCollapsed || false,
  avatar: stored.avatar || '',
  notificationDrafts: stored.notificationDrafts || [],
  ui: { userMenuOpen: false },
  selectedPlaceId: stored.selectedPlaceId || 'casa',
  selectedDeviceId: stored.selectedDeviceId || 'esp32-casa-1',
  profile: {
    fullName: stored.fullName || 'Fernando Gambino',
    email: stored.email || 'fmgambino@admin.com',
    role: stored.role || 'Administrador',
    company: 'Electrónica Gambino'
  },
  summary: { totalClients: 16, totalDevices: 48, alerts: 5, online: 37 },
  clients: [
    { id: 'cli-1', name: 'Agro Norte', plan: 'PyME', status: 'active', devices: 4 },
    { id: 'cli-2', name: 'Frío Sur', plan: 'Business', status: 'active', devices: 12 },
    { id: 'cli-3', name: 'Metalúrgica Río', plan: 'Emprender', status: 'pending_payment', devices: 1 },
    { id: 'cli-4', name: 'Hornos Salta', plan: 'PyME', status: 'active', devices: 3 }
  ],
  notifications: stored.notifications || [
    { id: 'n1', title: 'MQ135 fuera de rango', message: 'El dispositivo ESP32-Casa-1 superó el umbral de gases.', date: '2026-04-13 17:15', read: false, target: 'Agro Norte' },
    { id: 'n2', title: 'Plan próximo a vencer', message: 'Metalúrgica Río vence en 3 días.', date: '2026-04-13 12:02', read: false, target: 'Metalúrgica Río' },
    { id: 'n3', title: 'Reset remoto ejecutado', message: 'Se reinició el equipo ESP32-Casa-1.', date: '2026-04-12 20:44', read: true, target: 'Casa' }
  ],
  places: [
    { id: 'casa', name: 'Casa' },
    { id: 'deposito', name: 'Depósito' },
    { id: 'laboratorio', name: 'Laboratorio' }
  ],
  devicesByPlace: {
    casa: [
      { id: 'esp32-casa-1', name: 'ESP32-Casa-1', online: true },
      { id: 'esp32-casa-2', name: 'ESP32-Casa-2', online: false }
    ],
    deposito: [{ id: 'esp32-deposito-1', name: 'ESP32-Deposito-1', online: true }],
    laboratorio: [{ id: 'esp32-lab-1', name: 'ESP32-Lab-1', online: true }]
  },
  sensors: [
    { id: 's1', title: 'DHT22', icon: 'thermometer', value: '28.6 °C', sub: 'Hum: 62 %', trend: 'Estable' },
    { id: 's2', title: 'MQ135', icon: 'flask-conical', value: 'CO₂ 421 ppm', sub: 'Metano 34 ppm', trend: 'Normal' },
    { id: 's3', title: 'pH', icon: 'test-tubes', value: '6.8', sub: 'Calibrado', trend: 'Óptimo' },
    { id: 's4', title: 'Nivel H₂O', icon: 'droplets', value: '74 %', sub: 'Tanque 1', trend: 'Subiendo' },
    { id: 's5', title: 'Voltaje', icon: 'zap', value: '12.4 V', sub: 'Fuente principal', trend: 'Normal' },
    { id: 's6', title: 'Hum. Suelo', icon: 'sprout', value: '41 %', sub: 'Canal 1', trend: 'Baja' }
  ],
  actuators: [
    { id: 'a1', title: 'Grupo electrógeno', icon: 'power', active: true },
    { id: 'a2', title: 'Lámpara', icon: 'lightbulb', active: true },
    { id: 'a3', title: 'Ventilador', icon: 'fan', active: false },
    { id: 'a4', title: 'Válvula', icon: 'gauge', active: true }
  ],
  devicesAdmin: [
    { id: 'd1', name: 'ESP32-Casa-1', client: 'Agro Norte', place: 'Casa', status: 'online', lastSeen: 'Hace 2 min', identifier: 'ESP12345' },
    { id: 'd2', name: 'ESP32-Deposito-1', client: 'Frío Sur', place: 'Depósito', status: 'offline', lastSeen: 'Hace 1 h', identifier: 'ESP77777' },
    { id: 'd3', name: 'ESP32-Lab-1', client: 'Hornos Salta', place: 'Laboratorio', status: 'warning', lastSeen: 'Hace 12 min', identifier: 'ESP44990' }
  ]
};
export function persistUI() {
  localStorage.setItem('medtuciot-ui', JSON.stringify({
    theme: state.theme,
    sidebarCollapsed: state.sidebarCollapsed,
    avatar: state.avatar,
    notifications: state.notifications,
    notificationDrafts: state.notificationDrafts,
    selectedPlaceId: state.selectedPlaceId,
    selectedDeviceId: state.selectedDeviceId,
    fullName: state.profile.fullName,
    email: state.profile.email,
    role: state.profile.role
  }));
}

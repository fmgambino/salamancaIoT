export function success(message) { return Swal.fire({ icon: 'success', title: 'Éxito', text: message, confirmButtonText: 'Aceptar' }); }
export function error(message) { return Swal.fire({ icon: 'error', title: 'Error', text: message, confirmButtonText: 'Cerrar' }); }
export function warning(message) { return Swal.fire({ icon: 'warning', title: 'Atención', text: message, confirmButtonText: 'Entendido' }); }
export function confirmAction(message, title = 'Confirmar acción') {
  return Swal.fire({ icon: 'question', title, text: message, showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'Cancelar' });
}

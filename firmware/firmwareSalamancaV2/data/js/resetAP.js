document.addEventListener('DOMContentLoaded', () => {
    const resetApCheckbox = document.getElementById('resetAp');

    resetApCheckbox.addEventListener('change', function() {
        if (this.checked) {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "¡Estás a punto de Resetear el Modo AP!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, resetea"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/resetAP', { method: 'POST' })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                Swal.fire({
                                    title: "¡Éxito!",
                                    text: "Modo AP reseteado exitosamente. El dispositivo se reiniciará.",
                                    icon: "success"
                                }).then(() => {
                                    resetApCheckbox.checked = false; // Volver a desactivar el switch
                                });
                            } else {
                                Swal.fire({
                                    title: "¡Error!",
                                    text: `Error al resetear el modo AP: ${data.error}`,
                                    icon: "error"
                                });
                                console.error('Error al resetear el modo AP:', data.error);
                                resetApCheckbox.checked = false; // Volver a desactivar el switch
                            }
                        })
                        .catch(error => {
                            Swal.fire({
                                title: "¡Error!",
                                text: 'Error al hacer la solicitud de reseteo de AP.',
                                icon: "error"
                            });
                            console.error('Error al hacer la solicitud de reseteo de AP:', error);
                            resetApCheckbox.checked = false; // Volver a desactivar el switch
                        });
                } else {
                    // Deselecciona el checkbox si el usuario cancela la acción
                    resetApCheckbox.checked = false;
                }
            });
        }
    });
});

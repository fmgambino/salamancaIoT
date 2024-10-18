// Función para editar el nombre del dispositivo
function editName(idDispositivo) {
    console.log("Editando dispositivo con ID:", idDispositivo);
    const deviceNameElement = document.getElementById(`device-name-${idDispositivo}`);
    Swal.fire({
        title: `Editar nombre del Toma ${idDispositivo}`,
        input: 'text',
        inputLabel: 'Nuevo nombre del dispositivo',
        inputValue: deviceNameElement.textContent.trim(),
        inputPlaceholder: 'Ingrese el nombre del dispositivo',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#d33',
        inputValidator: (valor) => {
            if (!valor) {
                return '¡Necesitas escribir algo!';
            }
        }
    }).then(result => {
        if (result.isDismissed) {
            // Acción al cancelar
        } else if (result.isConfirmed) {
            guardarNombreDispositivo(idDispositivo, result.value);
        }
    });
}

// Función para guardar el nombre del dispositivo
function guardarNombreDispositivo(idDispositivo, nuevoNombre) {
    fetch('/update-relay-name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: idDispositivo,
            name: nuevoNombre
        }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Nombre guardado correctamente.');
            document.getElementById(`device-name-${idDispositivo}`).textContent = nuevoNombre;
            Swal.fire('¡Éxito!', 'Nombre actualizado correctamente.', 'success');
        } else {
            console.error('Error al guardar el nombre:', response.statusText);
            Swal.fire('Error', 'Error al guardar el nombre. Por favor, intente nuevamente.', 'error');
        }
    })
    .catch(error => {
        console.error('Error al guardar el nombre del dispositivo:', error);
        Swal.fire('Error', 'Error al guardar el nombre. Por favor, intente nuevamente.', 'error');
    });
}

// Agregar event listener a todos los iconos de edición
document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const idDispositivo = this.getAttribute('data-id');
        editName(idDispositivo);
    });
});
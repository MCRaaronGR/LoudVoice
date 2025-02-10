document.getElementById('generate-pdf-button').addEventListener('click', async () => {
    try {
        // Obtener el nombre de usuario desde el Backend
        const response = await fetch('/username', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Si usas JWT
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener el nombre del usuario');
        }

        const data = await response.json();
        const username = data.username;

        // Realiza la solicitud POST para generar el PDF
        const pdfResponse = await fetch('/api/generar-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }), // Envía el nombre de usuario en el cuerpo de la solicitud
        });

        if (!pdfResponse.ok) {
            throw new Error('Error en la generación del PDF');
        }else{
            Swal.fire({
                title: 'Expediente generado, descargado y enviado',
                icon: 'success',
                text: 'Muy bien, tu expediente ha sido descargado en tu dispositivo y se a enviado a la autoridad pertinente mediante correo electronico',
                confirmButtonText: 'OK'
            });
        }

        const blob = await pdfResponse.blob(); // Recibe el archivo PDF como Blob

        // Crea un enlace para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultado_test_${username}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Libera la URL del Blob

    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al generar el PDF. Inténtalo de nuevo.');
    }
});

//Verificar si el usuario ya tiene experiencia guardada
async function verificarExperienciaGuardada() {
    const response = await fetch('/mis-experiencias', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });

    const experiencias = await response.json();
    return experiencias.length > 0 ? experiencias[0].experiencia : null;
}

//Desplegar area según sea el caso
async function mostrarTextarea(accion) {
    const experienciaGuardada = await verificarExperienciaGuardada();
    const experienciaDiv = document.getElementById('experienciaDiv');
    const textarea = document.getElementById('experienciaTextarea');

    if (experienciaGuardada) {
        if (accion === 'agregar') {
            Swal.fire({
                icon: 'info',
                title: 'Ya tienes una experiencia guardada',
                text: 'Ya tienes una experiencia guardada, actualízala :D',
                confirmButtonText: 'Actualizar experiencia'
            }).then(() => {
                textarea.value = experienciaGuardada; // Mostrar la experiencia guardada en el textarea
                experienciaDiv.style.display = 'block'; // Mostrar el div con el textarea
            });
        } else if (accion === 'editar') {
            textarea.value = experienciaGuardada; // Mostrar la experiencia guardada en el textarea
            experienciaDiv.style.display = 'block'; // Mostrar el div con el textarea
        }
    } else {
        if (accion === 'agregar') {
            textarea.value = ''; // Vaciar el textarea para una nueva experiencia
            experienciaDiv.style.display = 'block'; // Mostrar el div con el textarea
        } else if (accion === 'editar') {
            Swal.fire({
                icon: 'info',
                title: 'Sin experiencia guardada',
                text: 'Parece que no tienes ninguna experiencia guardada, por favor ingresa una nueva.',
                confirmButtonText: 'Agregar experiencia'
            }).then(() => {
                mostrarTextarea('agregar'); // Después de la alerta, mostrar el textarea para agregar una nueva experiencia
            });
        }
    }
}
//Guardar y/o actualizar Experiencia
async function guardarExperiencia() {
    const experiencia = document.getElementById('experienciaTextarea').value;

    try {
        const response = await fetch('/guardar-experiencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ experiencia })
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡Experiencia guardada!',
                text: 'Tu experiencia ha sido guardada con éxito.',
                confirmButtonText: '¡Genial!'
            });
            document.getElementById('experienciaDiv').style.display = 'none'; // Ocultar textarea después de guardar
        } else {
            throw new Error('Error al guardar la experiencia');
        }
    } catch (error) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Parece que no has escrito nada, si no te sientes list@ no te preocupes, puedes regresar despues :D',
            confirmButtonText: 'Esta bien'
        });
    }
}
//Boton testimonios
document.getElementById('Btnvideos').addEventListener('click', function(){
    window.open('/VentanaUs', '_self');
});
//Boton informacion
document.getElementById('BtnEstadist').addEventListener('click', function(){
    window.open('/InformacionA', '_self');
});
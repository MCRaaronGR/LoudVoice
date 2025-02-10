document.addEventListener('DOMContentLoaded', () => {
    const formAgregarVideo = document.getElementById('formAgregarVideo');
    const btnAgregarVideo = document.getElementById('btnAgregarVideo');
    const mensaje = document.getElementById('mensaje');

    btnAgregarVideo.addEventListener('click', async () => {
        const formData = new FormData(formAgregarVideo);
        const videoFile = formData.get('videoFile');
        const titulo = formData.get('titulo');

        // 1. Verificar si hay un archivo para subir
        if (!videoFile || videoFile.size === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, agrega un video para subirlo',
            });
            return;
        }

        // 2. Verificar si se ha escrito un título
        if (!titulo || titulo.trim() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, agrega un título para tu video',
            });
            return;
        }

        // Primero, sube el archivo
        try {
            const uploadResponse = await fetch('/upload-video', {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error(`Error al subir el video: ${uploadResponse.status} - ${uploadResponse.statusText}`);
            }

            const uploadData = await uploadResponse.json();
            if (!uploadData.success) {
                throw new Error(uploadData.message);
            }

            const fileName = uploadData.fileName;

            // Luego, agrega los datos del video a la base de datos
            const response = await fetch('/add-video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Enviar el token JWT
                },
                body: JSON.stringify({
                    title: formData.get('titulo'),
                    fileName: fileName
                })
            });

            if (!response.ok) {
                throw new Error(`Error al agregar video: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Video agregado:', data.video);
            mensaje.innerHTML = `<p>Video agregado correctamente: ${data.video.title}</p>`;
            // Mostrar alerta de éxito
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: `El video "${data.video.title}" ha sido agregado correctamente.`,
            });
            formAgregarVideo.reset(); // Limpiar el formulario después de enviar
        } catch (error) {
            console.error('Error al agregar video:', error.message);
            mensaje.innerHTML = `<p>${error.message}</p>`;
            // Mostrar alerta de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        }
    });
});

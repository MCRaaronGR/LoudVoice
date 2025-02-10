
document.addEventListener('DOMContentLoaded', function() {
    // Agregar evento al botón de cerrar sesión
    document.getElementById('logoutButton').addEventListener('click', function() {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.loggedOut) {
                localStorage.removeItem('token');
                // Mostrar SweetAlert de sesión cerrada correctamente
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión cerrada',
                    text: 'La sesión ha sido cerrada correctamente',
                    confirmButtonText: 'OK',
                    timer: null
                }).then(() => {
                    window.location.href = '/home'; // Redirigir a la página de inicio o login
                });
            } else {
                console.error('No se pudo cerrar la sesión correctamente');
                // Manejar el error o mostrar un mensaje al usuario
            }
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
            Swal.fire({
                icon: 'warning',
                title: 'eError de sesión',
                text: 'Lo sentimos, hubo un error al cerrar la sesión',
                confirmButtonText: 'OK',
                timer: null
            }).then(() => {
                window.location.href = '/home'; // Redirigir a la página de inicio o login
            });
        });
    });
});

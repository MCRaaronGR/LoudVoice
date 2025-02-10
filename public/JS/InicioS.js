document.getElementById('imgInicioSesion').addEventListener('click', function() {
    const token = localStorage.getItem('token');
    fetch('/checkSession', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Asegúrate de que el token se envíe en el formato correcto
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.sesionActiva) {
            Swal.fire({
                icon: 'warning',
                title: 'Sesión en curso',
                text: 'Ya hay una sesión activa en otra ventana',
                showCancelButton: true,
                confirmButtonText: 'Ir al menú principal',
                cancelButtonText: 'Cerrar sesión'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/menuP';
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    fetch('/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` // Asegúrate de que el token se envíe en el formato correcto
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.loggedOut) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Sesión cerrada',
                                text: 'La sesión ha sido cerrada correctamente',
                                confirmButtonText: 'OK'
                            }).then(() => {
                                localStorage.removeItem('token');
                                window.location.href = '/home';
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'No se pudo cerrar la sesión correctamente'
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error al cerrar sesión:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al intentar cerrar la sesión'
                        });
                    });
                }
            });
        } else {
            Swal.fire({
                title: 'Inicio de sesión',
                width: '90%',
                html: `
                    <form id="loginForm">
                        <label for="username">Usuario:</label>
                        <input type="text" id="username" name="username" class="swal2-input" required>
                        <label for="password">Contraseña:</label>
                        <input type="password" id="password" name="password" class="swal2-input" required>
                        <button type="submit" id="loginButton" class="swal2-confirm swal2-styled" style="display: inline-block;">Iniciar sesión</button>
                    </form>
                `,
                allowOutsideClick: true,
                showConfirmButton: false
            });

            document.getElementById('loginForm').addEventListener('submit', function(event) {
                event.preventDefault();

                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        localStorage.setItem('token', data.token);
                        window.location.href = '/menuP';
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Usuario o contraseña incorrectos'
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un problema con el inicio de sesión'
                    });
                });
            });
        }
    })
    .catch(error => {
        console.error('Error al verificar sesión:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al verificar la sesión'
        });
    });
});

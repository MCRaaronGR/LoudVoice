document.addEventListener('DOMContentLoaded', function() {
    // Solicitar el nombre del usuario y actualizar el HTML
    fetch('/username', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('NombreUs').textContent = data.username;
        } else {
            console.error('Error al obtener el nombre del usuario:', data.message);
        }
    })
    .catch(error => {
        console.error('Error al obtener el nombre del usuario:', error);
    });
});

//Boton informacion
document.getElementById('BtnEstadist').addEventListener('click', function(){
    window.open('/InformacionA', '_self');
});
document.getElementById('BtnExpediente').addEventListener('click', function(){
    window.location.href = '/test';
});
//Boton controlador
document.getElementById('BtnMas').addEventListener('click', function(){
    window.open('/Controlador', '_self');
});

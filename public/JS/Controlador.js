// Seleccionar el botón "Leer términos y condiciones" por su ID y los otros elementos necesarios
const leerTerminosButton = document.getElementById('TerminosCond');
const terminosDiv = document.getElementById('DivCondic');
const confirmationCheckbox = document.getElementById('Confirmation');
const formularioSubirDiv = document.getElementById('FrmSub');

// Mostrar el div de términos y condiciones al hacer clic en el botón
if (leerTerminosButton) {
    leerTerminosButton.addEventListener('click', () => {
        if (terminosDiv) {
            terminosDiv.classList.toggle('hidden'); // Alternar visibilidad
            terminosDiv.classList.toggle('visible');
        }
    });
}

// Mostrar el div del formulario si el checkbox está seleccionado
if (confirmationCheckbox) {
    confirmationCheckbox.addEventListener('change', () => {
        if (formularioSubirDiv) {
            if (confirmationCheckbox.checked) {
                formularioSubirDiv.classList.add('visible');
                formularioSubirDiv.classList.remove('hidden');
            } else {
                formularioSubirDiv.classList.add('hidden');
                formularioSubirDiv.classList.remove('visible');
            }
        }
    });
}
//Boton informacion
document.getElementById('BtnEstadist').addEventListener('click', function(){
    window.open('/InformacionA', '_self');
});
document.getElementById('BtnExpediente').addEventListener('click', function(){
    window.location.href = '/test';
});
//Boton testimonios
document.getElementById('Btnvideos').addEventListener('click', function(){
    window.open('/VentanaUs', '_self');
});

function mostrarContenido() {
    document.getElementById('Informacion52').style.display = 'block';
    document.getElementById('BtnMas51').style.display = 'none';
    document.getElementById('BtnMenos51').style.display = 'inline-block';
};
function ocultarContenido() {
    document.getElementById('Informacion52').style.display = 'none';
    document.getElementById('BtnMas51').style.display = 'inline-block';
    document.getElementById('BtnMenos51').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('BtnSP');
    const cyRDiv = document.getElementById('SPDiv');

    toggleButton.addEventListener('click', function() {
        cyRDiv.classList.toggle('mostrar');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('BtnPC');
    const cyRDiv = document.getElementById('PCDiv');

    toggleButton.addEventListener('click', function() {
        cyRDiv.classList.toggle('mostrar');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('BtnRL');
    const cyRDiv = document.getElementById('RLDiv');

    toggleButton.addEventListener('click', function() {
        cyRDiv.classList.toggle('mostrar');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('BtnRaS');
    const cyRDiv = document.getElementById('RaSDiv');

    toggleButton.addEventListener('click', function() {
        cyRDiv.classList.toggle('mostrar');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('BtnInD');
    const cyRDiv = document.getElementById('InDDiv');

    toggleButton.addEventListener('click', function() {
        cyRDiv.classList.toggle('mostrar');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('BtnRR');
    const cyRDiv = document.getElementById('RRDiv');

    toggleButton.addEventListener('click', function() {
        cyRDiv.classList.toggle('mostrar');
    });
});
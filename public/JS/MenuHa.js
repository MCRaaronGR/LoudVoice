const nav = document.querySelector('#CH');
const abrir = document.querySelector('#AbrirM');
const cerrar = document.querySelector('#CerrarM');

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})
cerrar.addEventListener("click", () => {
    nav.classList.remove("visible")
})
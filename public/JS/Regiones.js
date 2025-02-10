document.addEventListener("DOMContentLoaded", function() {
    // Obtén todas las regiones del mapa
    const regions = document.querySelectorAll(".map-region");
  
    // Añade un event listener a cada región
    regions.forEach(region => {
      region.addEventListener("click", function() {
        // Obtén el iframe
        const iframe = document.querySelector(".InfoDesplegable");
  
        // Cambia la URL del iframe a la data-info de la región clicada
        iframe.src = this.getAttribute("data-info");
      });
    });
  });





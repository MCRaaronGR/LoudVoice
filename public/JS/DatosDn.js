document.addEventListener('DOMContentLoaded', function() {
    // Cargar videos
    function cargarVideos() {
        fetch('/videos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const videos = data.videos;
                const videosContainer = document.getElementById('videos-container');
                videosContainer.innerHTML = '';

                videos.forEach(video => {
                    const videoElement = document.createElement('div');
                    videoElement.classList.add('carousel-item');
                    videoElement.innerHTML = `
                        <video controls>
                            <source src="/videos/${video.localPath}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <div class="carousel-item-footer">
                            <p id="VideoTitle">${video.title}</p>
                        </div>
                    `;
                    videosContainer.appendChild(videoElement);
                });

                // Inicializar el carrusel
                let currentIndex = 0;
                const items = document.querySelectorAll('.carousel-item');
                const totalItems = items.length;

                function updateCarousel() {
                    const offset = -currentIndex * 100;
                    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
                    stopAllVideos(); // Detener todos los videos cuando se cambia el slide
                }

                function stopAllVideos() {
                    const videos = document.querySelectorAll('.carousel-item video');
                    videos.forEach(video => {
                        video.pause(); // Pausar el video
                    });
                }

                document.getElementById('prevBtn').addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalItems - 1;
                    updateCarousel();
                });

                document.getElementById('nextBtn').addEventListener('click', () => {
                    currentIndex = (currentIndex < totalItems - 1) ? currentIndex + 1 : 0;
                    updateCarousel();
                });

                // Evento para botón de nuevos videos
                document.getElementById('newVideosButton').addEventListener('click', () => {
                    cargarVideos(); // Volver a cargar videos
                });
            } else {
                console.error('Error al cargar los videos:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al cargar los videos:', error);
        });
    }

    cargarVideos();
});

 document.addEventListener('DOMContentLoaded', function() {
            // Actualizar año de copyright
            document.getElementById('year').textContent = new Date().getFullYear();
            
            // Crear un audio para cada reproductor
            const players = document.querySelectorAll('.mini-player');
            
            players.forEach(player => {
                const audio = new Audio();
                const playBtn = player.querySelector('.play-btn');
                const progressBar = player.querySelector('.progress-bar');
                const progressContainer = player.querySelector('.progress-container');
                const currentTimeEl = player.querySelector('.current-time');
                const durationEl = player.querySelector('.duration');
                const volumeControl = player.querySelector('.volume-control');
                let isPlaying = false;
                
                // Cargar la canción
                audio.src = player.getAttribute('data-audio');
                
                // Formatear tiempo (mm:ss)
                function formatTime(seconds) {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                }
                
                // Actualizar barra de progreso
                function updateProgress() {
                    const { currentTime, duration } = audio;
                    const progressPercent = (currentTime / duration) * 100;
                    progressBar.style.width = `${progressPercent}%`;
                    currentTimeEl.textContent = formatTime(currentTime);
                    
                    // Actualizar duración si está disponible
                    if (duration && !isNaN(duration)) {
                        durationEl.textContent = formatTime(duration);
                    }
                }
                
                // Establecer progreso al hacer clic en la barra
                function setProgress(e) {
                    const width = this.clientWidth;
                    const clickX = e.offsetX;
                    const duration = audio.duration;
                    audio.currentTime = (clickX / width) * duration;
                }
                
                // Event listeners
               playBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Añade esto
    if (isPlaying) {
        audio.pause();
        this.textContent = '▶';
    } else {
        // Añade esto antes de play():
        audio.load(); 
        audio.play().catch(error => {
            console.error("Error al reproducir:", error);
        });
        this.textContent = '❚❚';
    }
    isPlaying = !isPlaying;
});
                
                audio.addEventListener('timeupdate', updateProgress);
                audio.addEventListener('ended', function() {
                    audio.currentTime = 0;
                    progressBar.style.width = '0%';
                    currentTimeEl.textContent = '0:00';
                    playBtn.textContent = '▶';
                    isPlaying = false;
                });
                
                progressContainer.addEventListener('click', setProgress);
                
                volumeControl.addEventListener('input', function() {
                    audio.volume = this.value;
                });
                
                // Cuando los metadatos están cargados (para obtener duración)
                audio.addEventListener('loadedmetadata', function() {
                    durationEl.textContent = formatTime(audio.duration);
                });
            });
        });
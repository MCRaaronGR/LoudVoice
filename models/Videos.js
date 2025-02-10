const mongoose = require('mongoose');

// Define el esquema del video
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    localPath: {
        type: String, // Ruta local al archivo de video
        required: true
    },
    userTypes: {
        type: [String], // Array de strings para múltiples tipos de usuario que pueden ver el video
        required: true
    }
});

// Crea y exporta el modelo 'Video' basado en el esquema
const Video = mongoose.model('Video', videoSchema);
module.exports = Video;

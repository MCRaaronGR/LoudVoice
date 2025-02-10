const mongoose = require('mongoose');

const experienciaSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    experiencia: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const Experiencia = mongoose.model('Experiencia', experienciaSchema);
module.exports = Experiencia;

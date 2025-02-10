const mongoose = require('mongoose');

const EnvioSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    correoEnviado: { type: Boolean, default: false },
    fechaEnvio: { type: Date, default: Date.now }
});

const Envio = mongoose.model('Envio', EnvioSchema);
module.exports = Envio;
const mongoose = require('mongoose');
//Define el esquema de respuestas del Test
const testResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imagenRespuestas: {
        type: Object,
        required: true
    },
    puntuacionesParte2: {
        type: Object,
        required: true
    },
    puntuacionesParte3: {
        type: Object,
        required: true
    }
});

const TestResult = mongoose.model('TestResult', testResultSchema);
module.exports = TestResult;

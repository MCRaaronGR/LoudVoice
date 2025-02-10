const mongoose = require('mongoose');
// Define el esquema del usuario
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    userTypes: {
        type: [String] // Array de strings para múltiples tipos de usuario
    }
});

// Crea y exporta el modelo 'User' basado en el esquema
const User = mongoose.model('User', userSchema);
module.exports = User;

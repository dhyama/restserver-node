/************************************************************************
 * Modulo en el que trabajaremos el modelo de datos de USUARIO de la BD *
 ***********************************************************************/

//Importamos la libreria de mongoose
const mongoose = require('mongoose');

//Obtenemos el esquema de mongoose
let Schema = mongoose.Schema; //Se pone en mayuscula por convención

//Definimos la estructura del esquema que va a tener el usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String, //Tipo de campo
        required: [true, 'El nombre es necesario'] //De esta forma definimos el mensaje cuando el campo requerido no esta cumplimentado
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: true //Si no queremos definir un mensaje lo dejariamos de esta manera
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    goolge: {
        type: Boolean,
        default: false
    }
});

//Exportamos el esquema con el nombre 'Usuario'
module.exports = mongoose.model('Usuario', usuarioSchema);
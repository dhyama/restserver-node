/************************************************************************
 * Modulo en el que trabajaremos el modelo de datos de USUARIO de la BD *
 ***********************************************************************/

//Importamos la libreria de mongoose
const mongoose = require('mongoose');
//Importamos la libreria para la validación de datos de moongose
const uniqueValidator = require('mongoose-unique-validator');

//Creamos los posibles valores para el campo de rol
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'], //Definimos los valores validos para los roles
    message: '{VALUE} no es un rol válido' //Definimos el mensaje de error en caso de que el valor introducido no este en los especificados
}

//Obtenemos el esquema de mongoose
let Schema = mongoose.Schema; //Se pone en mayuscula por convención (Siempre que vayamos a utilizarlo como clase para un new)

//Definimos la estructura del esquema que va a tener el usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String, //Tipo de campo
        required: [true, 'El nombre es necesario'] //De esta forma definimos el mensaje cuando el campo requerido no esta cumplimentado
    },
    email: {
        type: String,
        unique: true, //Definimos este campo como único para que nuestra validación impida guardar registros con el mismo email
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false //Si no queremos definir un mensaje lo dejariamos de esta manera
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
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

//Indicamos al esquema que plugin tiene que usar y el formato del mensaje
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.' })

//Exportamos el esquema con el nombre 'Usuario'
module.exports = mongoose.model('Usuario', usuarioSchema);
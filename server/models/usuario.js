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
    google: {
        type: Boolean,
        default: false
    }
});

//Vamos a modificar el metodo toJSON del esquema para eliminar en la salida el campo password,
// ya que es el que utilizamos normalmente para la salida de datos
// es como modificar un prototipo de las clases de javascript
usuarioSchema.methods.toJSON = function() {
    //No utilizamos función de flecha ya que necesitamos utilizar el this.
    // almacenamos lo que tenemos en la función en ese momento en un objeto usuario
    let user = this;
    //Creamos un objeto clon para poderlo modificar
    let userObject = user.toObject();
    //Eliminamos la propiedad del objeto clonado
    delete userObject.password;
    //Devolvemos el objeto usuario sin password
    return userObject;
}

//Indicamos al esquema que plugin tiene que usar y el formato del mensaje en caso de error
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.' })

//Exportamos el esquema con el nombre 'Usuario'
module.exports = mongoose.model('Usuario', usuarioSchema);
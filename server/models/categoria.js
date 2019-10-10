/**************************************************************************
 * Modulo en el que trabajaremos el modelo de datos de CATEGORIA de la BD *
 *************************************************************************/

//Importamos la libreria de mongoose
const mongoose = require('mongoose');
//Importamos la libreria para la validación de datos de moongose
const uniqueValidator = require('mongoose-unique-validator');

//Obtenemos el esquema de mongoose
let Schema = mongoose.Schema; //Se pone en mayuscula por convención (Siempre que vayamos a utilizarlo como clase para un new)

//Definimos la estructura del esquema que va a tener la categoría
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true, //Definimos este campo como único para que nuestra validación impida guardar registros con la misma descripción
        required: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

//Indicamos al esquema que plugin tiene que usar y el formato del mensaje en caso de error
categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser única.' })

//Exportamos el esquema con el nombre 'Categoria'
module.exports = mongoose.model('Categoria', categoriaSchema);
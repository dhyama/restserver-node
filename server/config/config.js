/************************************************************************
 * Módulo en el que realizaremos la configuración global del servicio   *
 ***********************************************************************/
// Este modulo se ejecutara en el momento en el que lo invoquemos con required desde el servidor principal
//  Con el podremos configurar las variables para el entorno de desarrollo y el de producción.
// process es una variable global que esta corriendo todo el tiempo y donde tenemos las variables de entorno

//=====================
//Puerto
//=====================
process.env.PORT = process.env.PORT || 3000; //Sobreescribimos el puerto del entorno y si no tenemos los inicializamos a 3000

//=====================
//Entorno
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; //Esta variable si existe es que estamos en Heroku o producción, sino es que estamos en desarrollo

//=====================
//Base de datos
//=====================
let urlDB;

// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/cafe';
// } else {
urlDB = 'mongodb+srv://dhyama:DJef7jwKOMdlrKP4@cluster0-gqumd.mongodb.net/cafe';
// }

//Generamos nuestra propia variable de entorno URLDB y la inicializamos con el valor obtenido
process.env.URLDB = urlDB;
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

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //Primero debemos generar una variable de entorno en heroku (heroku config:set MONGO_URI="mongodb+srv://dhyama:<XXXXXXX>@cluster0-gqumd.mongodb.net/cafe")
    // de esta manera no tenemos publicado en nuestro repositorio público la cadena de conexión a la BD de Atlas, ya que esta en heroku almacenada
    urlDB = process.env.MONGO_URI;
}

//Generamos nuestra propia variable de entorno URLDB y la inicializamos con el valor obtenido
process.env.URLDB = urlDB;

//=====================
//Vencimiento token
//=====================
// 60 segundos * 60 minutos * 24 horas * 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=========================
//Semilla de autenticación
//=========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; //Generamos una variable en Heroku con la SEED para que esta no esté pública en github

//=========================
//Google CLien ID
//=========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '263151479469-4u8c04vnvo4e97d44hn7t70362a284ma.apps.googleusercontent.com';
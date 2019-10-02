/************************************************************************
 * Módulo en el que realizaremos la configuración global del servicio   *
 ***********************************************************************/
// Este modulo se ejecutara en el momento en el que lo invoquemos con required desde el servidor principal
//  Con el podremos configurar las variables para el entorno de desarrollo y el de producción.
// process es una variable global que esta corriendo todo el tiempo y donde tenemos las variables de entorno

//Configuracion del puerto
process.env.PORT = process.env.PORT || 3000; //Sobreescribimos el puerto del entorno y si no tenemos los inicializamos a 3000
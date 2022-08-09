const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //conectar a base de datos
        this.conectarDB();
        //middlewares
        this.middlewares();

        //rutas
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //Cors (filtrado de peticiones)
        this.app.use( cors() );

        //Lectura y parseo del Body
        this.app.use( express.json());
        
        //Directorio Público
        this.app.use( express.static('public') )
    }

    routes() {
        this.app.use( this.authPath, require('../routes/auth.routes'));
        this.app.use(this.usuariosPath, require('../routes/user.routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en puerto', this.port);
        })
    }
}


module.exports = Server;
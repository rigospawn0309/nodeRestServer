const express = require('express');
const cors = require('cors');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //middlewares
        this.middlewares();

        //rutas
        this.routes();
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
        this.app.use(this.usuariosPath, require('../routes/user.routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en puerto', this.port);
        })
    }
}


module.exports = Server;
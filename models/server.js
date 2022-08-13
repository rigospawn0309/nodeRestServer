const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth: '/api/auth',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            productos: '/api/productos'
        }

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
        this.app.use( this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.usuarios, require('../routes/user.routes'));
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en puerto', this.port);
        })
    }
}


module.exports = Server;
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.js');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads'
        }


        // Conectar DB
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){

        // CORS
        this.app.use(cors());

        // Lectura y parseo
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public'));

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth.js'));
        this.app.use(this.paths.buscar, require('../routes/buscar.js'));   
        this.app.use(this.paths.categorias, require('../routes/categorias.js'));   
        this.app.use(this.paths.usuarios, require('../routes/user.js'));     
        this.app.use(this.paths.productos, require('../routes/productos.js'));   
        this.app.use(this.paths.uploads, require('../routes/uploads.js'));   
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("corriendo"+ this.port)
        })
    }
}


module.exports = Server;
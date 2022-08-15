const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'producto-categoria',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {
    //En este caso se puede buscar por id valid y por nombre o correo
    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] // se envia un array con nombre result para tener homogeneidad en los resultados
                                                    // con la ternaria se evita enviar un array null que podría indicar que existe un resultado pero null
        });
    }

    const regex = new RegExp( termino, 'i' ); //Expresion regular que con el 'i' es KEYSENSITIVE
    //Busco con operadores de mongo para filtrar las busquedas 
    //(En este caso busco un usuario que cuyo nombre o email con el KeySensitive y a su ves este con el estado a true)
    const usuarios = await Usuario.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    //Hago un count de los resultado con las mismas condiciones que el de arriba
    const userContador = await Usuario.count({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json({
        count: userContador,
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ name: regex, status: true });

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino)
    .populate('categoria','name');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const productos = await Producto.find({
        $or: [{ brand: regex }, { model: regex }, {operator: regex}, {condition: regex}],
        $and: [{ status: true }]
     })
    .populate('categoria','name')

    const productosContador = await Producto.count({
        $or: [{ brand: regex }, { model: regex }, {operator: regex}, {condition: regex}],
        $and: [{ status: true }]
    });

    res.json({
        count: productosContador,
        results: productos
    });

}

const buscarProductoCategoria = async( termino = '', res = response) => {
 
    try{
 
        const esMongoID = ObjectId.isValid( termino );
    
        if ( esMongoID ) {
            
            const producto = await Producto.find( { categoria: ObjectId( termino ), status: true})
            .select('brand model operator condition price description available status')
            .populate('categoria', 'name');
    
            return res.json( {
                results: ( producto ) ? [ producto ] : []
            });
        }
    
        const regex = new RegExp( termino, 'i' );
    
        const categorias = await Categoria.find({ name: regex, status: true});
 
        if ( !categorias.length ){
 
            return res.status(400).json({
 
                msg: `No hay resultados para ${ termino }`
 
            });
        }
        
        const productos = await Producto.find({
 
            $or: [...categorias.map( categoria => ({
 
                categoria: categoria._id
 
            }))],
 
            $and: [{ status: true }]
 
        }).populate('categoria', 'name');
 
        res.json({
            results: productos
        });
       
    } catch ( error ){
 
        res.status(400).json( error );
    }
}



const buscar = ( req, res = response ) => {
    //cojo las dos partes de la ruta api/buscar/{coleccion}/:{termino}, da igual el orden pero si el nombre
    const { coleccion, termino  } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }
    // Dependiendo de la coleccion se busca el termino
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;

        case 'producto-categoria':
            buscarProductoCategoria(termino, res);
        break;

        default:
            res.status(500).json({
                msg: 'Búsqueda no creada'
            })
    }

}



module.exports = {
    buscar
}


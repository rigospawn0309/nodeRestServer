const { response } = require('express');
const { Producto } = require('../models');
const categoria = require('../models/categoria');


//Get
const getProductos = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.params
    const query = {status: true}

    // obtengo en primer caso el total de categorias y el segundo el limite y el desde para filtrar
    // Hay que tener en cuenta que destructuro en array para obtener cada resultado de la promesa con su nombre
    const [ total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find( query )
        .populate('user','name')
        .populate('categoria','name')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    res.json({
        total,
        productos
    });
}

//Get por id
const getProducto = async(req, res = response) => {
    const {id} =  req.params; 
    const producto = await Producto.findById(id)
    .populate('user','name')
    .populate('categoria','name'); //creo otro populate para la categoria
     res.json(producto);
}

//Post
const postProducto = async(req, res = response) => {
    console.log('postProducto() BODY(): ', req.body);
    const { status, user, ...body} = req.body;
    const brand = req.body.brand.toUpperCase();
    const model = req.body.model.toUpperCase();
    const operator = req.body.operator.toUpperCase();
    const productoDB = await Producto.findOne({ model:body.model });

    if( productoDB ) {
        return res.status(400).json({
            msg: `El producto con modelo ${productoDB.model} ya existe`
        })
    }
    // Generar la data que quiero guardar 
    const data = {
        ...body, // se envia primero el rest y luego el bran que esta modificado sino se guardaria lo que viene del body
        brand,
        model,
        operator,
        user: req.usuario._id
    }

    const producto = new Producto( data );
    await producto.save();
    res.status(201).json( producto );
}

//put
const putProducto = async(req, res = response) => {
    console.log('putProducto() BODY(): ', req.body);
    const { id } =  req.params; 
    const { user, status, ...data } = req.body;
    if( data.brand){
        data.brand = data.brand.toUpperCase();
    }
    if( data.model){
        data.model = data.model.toUpperCase();
    }
    if( data.operator){
        data.operator = data.operator.toUpperCase();
    }
    const producto = await Producto.findByIdAndUpdate( id, data, {new: true})
     res.json(producto);
}

//Delete
const deleteProducto = async(req, res = response) => {
    const { id } = req.params;
    console.log(req.params);
    const producto = await Producto.findByIdAndUpdate( id , {status: false},{new: true});
    res.json({producto})
}




module.exports = {
    getProductos,
    getProducto,
    postProducto,
    putProducto,
    deleteProducto
}
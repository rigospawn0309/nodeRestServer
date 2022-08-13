const { response } = require('express');
const { Categoria } = require('../models')

//obtener categorias - paginado - total - populate
const getCategorias = async(req, res) => {
    const {limite = 5, desde = 0} = req.params
    const query = {status: true}

    // obtengo en primer caso el total de categorias y el segundo el limite y el desde para filtrar
    // Hay que tener en cuenta que destructuro en array para obtener cada resultado de la promesa con su nombre
    const [ total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find( query )
        .populate('user','name')
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        total,
        categorias
    });
};
//obtener categoria -  populate {}

const getCategoria = async(req, res = response) => {
    const {id} =  req.params; 
    const categoria = await Categoria.findById(id).populate('user','name');
     res.json(categoria);
}

//Crear categoria
const postCategoria = async(req, res = response) => {
    const name = req.body.name.toUpperCase();
    const categoriaDB = await Categoria.findOne({ name });

    if( categoriaDB ) {
        return res.status(400).json({
            msg: `la categoria ${categoriaDB.name} ya existe`
        })
    }
    // Generar la data que quiero guardar 
    const data = {
        name,
        user: req.usuario._id
    }

    const categoria = new Categoria( data );
    await categoria.save();
    res.status(201).json( categoria );
}

//Actualizar categoria - cambiar solo el nombre
const putCategoria = async (req, res) => {
    const { id } =  req.params; 
    const { user, status, ...data } = req.body;
    data.name = data.name.toUpperCase()

    const categoria = await Categoria.findByIdAndUpdate( id, data, {new: true})
     res.json(categoria);
};
//Borrar categoria - status: false
const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    const categoria = await Categoria.findByIdAndUpdate( id , {status: false},{new: true});
    res.json({categoria})
};


module.exports = {
    getCategorias,
    getCategoria,
    putCategoria,
    postCategoria,
    deleteCategoria

}
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const userGet = async(req, res) => {
    const {limite = 5, desde = 0} = req.params
    const query = {status: true}

    // obtengo en primer caso el total de usuarios y el segundo el limite y el desde para filtrar
    // Hay que tener en cuenta que destructuro en array para obtener cada resultado de la promesa con su nombre
    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find( query )
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        total,
        usuarios
    });
};

const userPut = async (req, res) => {
    const {id} =  req.params; 
    const {_id, password, google, email, ...resto } = req.body;

    //TODO validar contra db
    if( password ) {
        const salt = bcryptjs.genSaltSync(); //complejidad de la contraseña en vueltas, por defecto 10
        resto.password = bcryptjs.hashSync(password, salt); //creo la encriptación
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true})
     res.json(usuario);
};

const userPost =  async (req, res) => {
    
    const { name, email, password, role } = req.body;
    const usuario = new Usuario( { name, email,password, role } ); //obtengo la data en base al model Usuario
    
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); //complejidad de la contraseña en vueltas, por defecto 10
    usuario.password = bcryptjs.hashSync(password, salt) //creo la encriptación

    await usuario.save(); //guardarlo en db
    res.json({
        usuario
    })
};

const userDelete = async (req, res) => {
    const {id} = req.params;
    const usuario = await Usuario.findByIdAndUpdate( id , {status: false},{new: true});
    res.json({usuario})
};

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete
}

const userGet = (req, res) => {
    const params = req.query;
    res.json({
        msg: 'Get API - controller',
        params
    })
};

const userPut = (req, res) => {
    const {id} =  req.params; 
    res.json({
        msg: 'Put API - controller',
        id 
    })
};

const userPost = (req, res) => {
    const {nombre, edad} = req.body;
    res.json({
        msg: 'Post API - controller' ,
        nombre,
        edad
    })
};

const userDelete = (req, res) => {
    res.json({
        msg: 'Delete API - controller' 
    })
};

const userPatch = (req, res) => {
    res.json({
        msg: 'Patch API - controller' 
    })
};

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}
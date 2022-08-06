const {validationResult} = require('express-validator');

//permite gestionar los check en las rutas uno por uno sino lanza error
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors)
    }

    next();
}

module.exports = {
    validarCampos
}
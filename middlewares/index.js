//Al igual que ocurre con el index.html si 
const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles
}
const validarCampos  = require('../middlewares/validar-campos');
const validarJSW = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validarCampos,
    ...validarJSW,
    ...validaRoles
}
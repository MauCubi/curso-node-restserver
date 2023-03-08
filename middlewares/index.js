const validarCampos  = require('../middlewares/validar-campos');
const validarJSW = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivoSubir = require('../middlewares/validar-archivo');


module.exports = {
    ...validarCampos,
    ...validarJSW,
    ...validaRoles,
    ...validarArchivoSubir
}
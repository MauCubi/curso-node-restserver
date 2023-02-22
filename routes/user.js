const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete } = require('../controllers/usuarios');
const { esRoleValido, esCorreoValido, existeUsuarioPorId } = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJSW } = require('../middlewares/validar-jwt');
// const { esAdmin, tieneRol } = require('../middlewares/validar-roles');

const {validarCampos, validarJSW, esAdmin, tieneRol} = require('../middlewares'); 

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mas de 6 letras').isLength({min:6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( esCorreoValido ),
    //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
    
], usuariosPost);

router.delete('/:id',[
    validarJSW,
    //esAdmin,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
    ], usuariosDelete);



module.exports = router;
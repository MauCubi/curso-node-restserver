const { Router } = require('express');
const { check } = require('express-validator');
const { validarJSW, esAdmin } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');
const { productosGet, productoGetOne, crearProducto, productoPut, productoDelete } = require('../controllers/productos');
const { existeProductoPorId } = require('../helpers/db-validators');



const router = Router();

// Obtener productos
router.get('/', productosGet);

// Obtener una productos
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId )
], productoGetOne);

// Crear productos
router.post('/', [ 
    validarJSW,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio no es un numero').isNumeric(),
    validarCampos
], crearProducto );

// Actualizar productos
router.put('/:id',[ 
    validarJSW,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('precio', 'El precio no es un numero').isNumeric(),
    validarCampos
], productoPut);

// Borrar productos
router.delete('/:id',[
    validarJSW,
    esAdmin,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
], productoDelete);


module.exports = router;
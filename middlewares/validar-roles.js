const {request, tesponse} = require('express');


const esAdmin = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg:'Se quiere verificar el rol sin token primero'
        })        
    }

    const {rol, nombre} = req.usuario;
    

    if (rol != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administador`
        })
    }

    next();
}


const tieneRol = (...roles) => {
    return (req = request, res = response, next) => {
        
        if (!req.usuario) {
            return res.status(500).json({
                msg:'Se quiere verificar el rol sin token primero'
            })        
        }


        if( !roles.includes( req.usuario.rol)){
            return res.status(401).json({
                msg: 'El servicio require uno de estos roles'
            })
        }
        next();
    }
}


module.exports = {
    esAdmin,
    tieneRol
}
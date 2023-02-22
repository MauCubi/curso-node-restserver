const jwt = require('jsonwebtoken');
const {response, request} = require('express');
const Usuario = require('../models/usuario');

const validarJSW = async ( req = request, res = response , next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }    

    try {
        const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY );         
        
        // Leer user correspondiente al uid
        const usuario = await Usuario.findById(uid);   

        // Verificar si uid no esta baja
        if (!usuario) {
            return res.status(401).json({
                msg:'Token no valido - User no existe'
            })
        }

        // Verificar si uid no esta baja
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Token no valido - User con estado false'
            })
        }
        
        req.usuario = usuario; 
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no valido'
        })
    }

    console.log(token);    
}


module.exports = {
    validarJSW
}
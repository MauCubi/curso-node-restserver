const bcryptjs = require('bcryptjs');
const { response } = require('express');

const Usuario = require('../models/usuario'); 
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        
        // Verificar si email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        
        // Verificar estado
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            })
        }

        
        // Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Password'
            }) 
        }
        

        // Generar JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async ( req, res = response) => {
    const { id_token } = req.body;

    try {
        const {nombre, img, correo} = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({correo});             
        
        if (!usuario) {            
            const data = {
                nombre,
                correo,
                password: ':p',
                rol: 'USER_ROLE',
                img,
                google: true
            }
            usuario = new Usuario(data);            
            await usuario.save();            
        }
        
        if (!usuario.estado) {            
            res.status(401).json({
                msg: 'Hable con el admin'
            })            
        }       

        // Generar JWT
        const token = await generarJWT( usuario.id );

        console.log('Token' + token);
        
        res.json({
            usuario,
            token
        })        
    } catch (error) {
        
    }

}

module.exports = {
    login,
    googleSignIn
}
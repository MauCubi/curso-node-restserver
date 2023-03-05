const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {    

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    // const  usuarios = await Usuario.find(query)
    //     .skip(desde)
    //     .limit(limite);
    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(desde)
        .limit(limite)
    ])


    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // Encriptar contraseña
    // El salt es cuantas vueltas de encriptacion, mayor es mas seguro pero tarda mas
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar
    await usuario.save();    

    // regresa el usuario grabado
    res.json({       
        usuario
    })
}

const usuariosPut = async (req, res) => {

    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        usuario
    })
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params;
    //const uid = req.uid;
    
    

    // Fisicamente delete
    // const usuario = await Usuario.findByIdAndDelete(id)

    // Logicamente
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    const usuarioAuth = req.usuario;


    res.json({                
        usuario,
        usuarioAuth
        
    })
}


module.exports = {
    usuariosGet,
    usuariosDelete,
    usuariosPost,
    usuariosPut
}
const { response, request } = require('express');

const usuariosGet = (req = request, res) => {

    const {q, nombre, apikey} = req.query;

    res.json({                
        msg: "get API - Controlador",
        q,
        nombre,
        apikey
    })
}

const usuariosPost = (req, res) => {

    // const body = req.body;
    const {nombre, edad} = req.body;
    res.json({                
        msg: "Post API - Controlador",
        nombre,
        edad
    })
}

const usuariosPut = (req, res) => {

    const id = req.params.id;

    res.json({                
        msg: "Put API - Controlador",
        id
    })
}

const usuariosDelete = (req, res) => {
    res.json({                
        msg: "Delete API - Controlador"
    })
}


module.exports = {
    usuariosGet,
    usuariosDelete,
    usuariosPost,
    usuariosPut
}
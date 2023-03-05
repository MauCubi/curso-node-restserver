const { request, response } = require('express');
const { ObjectId } = require("mongoose").Types;
const {Usuario, Categoria, Producto} = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);        
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    })

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async(termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino);
    
    if (isMongoId) {
        const categoria = await Categoria.findById(termino);
        
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = RegExp(termino, 'i');

    const categorias = await Categoria.find({
        nombre: regex,
        $and: [{estado: true}]
    })

    res.json(categorias);

}

const buscarProductos = async(termino = '', res = response) => {

    const isMongoId = ObjectId.isValid(termino);
    
    if (isMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = RegExp(termino, 'i');

    const productos = await Producto.find({
        nombre: regex,
        $and: [{estado: true}]
    }).populate('categoria', 'nombre')

    res.json(productos);

}


const buscar = (req = request, res = response) => {

    const { coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'productos':
            buscarProductos(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'usuarios':
            buscarUsuarios(termino, res);
        break;    
    
        default:
            res.status(500).json({
                msg: 'No se ha implementado esta busqueda'
            })
        break;
    }


}



module.exports = {
    buscar
}
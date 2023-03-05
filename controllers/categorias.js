const { response } = require('express');
const { Categoria } = require('../models');



// Obtener categorias - paginado - total - populate
const categoriasGet = async (req = request, res = response) => {    

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};    

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre')
    ])

    res.json({
        total,
        categorias
    })
}

// Obtener categoria - populate
const categoriaGetOne = async (req, res) => {

    const {id} = req.params;    

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if (!categoria) {
        res.status(404).json({
            msg: `La categoria con el id ${ id } no existe`
        })
    }

    res.json({
        categoria
    })
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria: ${ categoriaDB.nombre } ya existe`
        })
    };

    // Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // Guardar en dv
    await categoria.save();

    res.status(201).json(categoria)
}


// Actualizar categoria 
const categoriaPut = async (req, res) => {

    const {id} = req.params;    
    const {usuario, estado, ...resto} = req.body;
    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, resto);

    res.json({
        categoria
    })
}

// Borrar categoria
const categoriaDelete = async (req, res = response) => {

    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false});

    res.json({                
        categoria      
        
    })
}

module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaGetOne,
    categoriaPut,
    categoriaDelete
}
const { response } = require('express');
const { Producto } = require('../models');




// Obtener productos
const productosGet = async (req = request, res = response) => {    

    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};    

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')        
    ])

    res.json({
        total,
        productos
    })
}

// Obtener producto
const productoGetOne = async (req, res) => {

    const {id} = req.params;    

    const producto = await Producto.findById(id)
    .populate('usuario', 'nombre')
    .populate('categoria', 'nombre');

    if (!producto) {
        res.status(404).json({
            msg: `El producto con el id ${ id } no existe`
        })
    }

    res.json({
        producto
    })
}

const crearProducto = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Producto.findOne({nombre});    
    if (productoDB) {
        return res.status(400).json({
            msg: `El producto: ${ productoDB.nombre } ya existe`
        })
    };

    // Generar data a guardar
    const data = {
        nombre,
        precio: req.body.precio,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    // Guardar en dv
    await producto.save();

    res.status(201).json(producto)
}


// Actualizar producto 
const productoPut = async (req, res) => {

    const {id} = req.params;    
    const {usuario, estado, ...resto} = req.body;
    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, resto);

    res.json({
        producto
    })
}

// Borrar producto
const productoDelete = async (req, res = response) => {

    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false});

    res.json({                
        producto              
    })
}

module.exports = {
    crearProducto,
    productosGet,
    productoGetOne,
    productoPut,
    productoDelete
}
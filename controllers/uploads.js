const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const { Usuario, Producto} = require('../models');


const cargarArchivo = async (req, res = response) => {

    try {
      const nombre = await subirArchivo( req.files, undefined, 'imgs' );
      res.json({ nombre });
    } catch (error) {
      res.status(400).json({ error });
    }

}

const actualizarImagen = async (req, res = response) => {

  const {id, coleccion} = req.params;
  let modelo;

  switch ( coleccion ) {

    case 'usuarios':
      modelo = await Usuario.findById(id);  
      if (!modelo) {
        return res.status(400).json({ msg: `No existe usuario con id ${id}`});
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);  
      if (!modelo) {
        return res.status(400).json({ msg: `No existe producto con id ${id}`});
      }
    break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto'});
      break;
  }

  // Limpiar imagenes previas 
  if (modelo.img) {
    // Borrar imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
    if ( fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo( req.files, undefined, coleccion );
  modelo.img = nombre;
  
  await modelo.save();

  res.json({ modelo });

}


const mostrarImagen = async (req, res = response) => {
  
  const {id, coleccion} = req.params;
  let modelo;

  switch ( coleccion ) {

    case 'usuarios':
      modelo = await Usuario.findById(id);  
      if (!modelo) {
        return res.status(400).json({ msg: `No existe usuario con id ${id}`});
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);  
      if (!modelo) {
        return res.status(400).json({ msg: `No existe producto con id ${id}`});
      }
    break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto'});
      
  }

  // Limpiar imagenes previas 
  if (modelo.img) {
    // Borrar imagen del servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);
    if ( fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathNotFound = path.join(__dirname,'../assets/no-image.jpg');    
  return res.sendFile(pathNotFound);


}


const actualizarImagenCloud = async (req, res = response) => {

  const {id, coleccion} = req.params;
  let modelo;

  switch ( coleccion ) {

    case 'usuarios':
      modelo = await Usuario.findById(id);  
      if (!modelo) {
        return res.status(400).json({ msg: `No existe usuario con id ${id}`});
      }
    break;

    case 'productos':
      modelo = await Producto.findById(id);  
      if (!modelo) {
        return res.status(400).json({ msg: `No existe producto con id ${id}`});
      }
    break;

    default:
      return res.status(500).json({ msg: 'Se me olvido validar esto'});
      break;
  }

  // Limpiar imagenes previas 
  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[ nombreArr.length - 1];

    const [ public_id ] = nombre.split('.');    

    await cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;

  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

  modelo.img = secure_url;  
  await modelo.save();

  res.json({ secure_url });

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloud
}
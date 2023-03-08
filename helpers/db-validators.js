const {Role, Usuario, Categoria, Producto} = require('../models');


const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

const esCorreoValido = async(correo) => {    
    const existeEmail = await Usuario.findOne({ correo });
    console.log(existeEmail);
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya esta registrado`);
    }
}

const existeUsuarioPorId = async(id) => {    
    const existeUsuario = await Usuario.findById(id);        
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeCategoriaPorId = async(id) => {    
    const existeCategoria = await Categoria.findById(id);        
    if (!existeCategoria) {
        throw new Error(`El id ${id} no existe`);
    }
}

const existeProductoPorId = async(id) => {    
    const existeProducto = await Producto.findById(id);        
    if (!existeProducto) {
        throw new Error(`El id ${id} no existe`);
    }
}

// Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
     
    const estaIncluida = colecciones.includes(coleccion);

    if (!estaIncluida) {
        throw new Error(`La coleccion ${coleccion} no esta permitida`);
    }

    return true;
}


module.exports = {
    esRoleValido,
    esCorreoValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}
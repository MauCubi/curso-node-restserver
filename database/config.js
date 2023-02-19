const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            

        });

        console.log('Base de datos online');
        
    } catch (error) {
        throw new Error('Error en el inicio de la base de datos');
    }
}




module.exports = {
    dbConnection
}
const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        
        await mongoose.connect( 'mongodb+srv://macubi90:TmEHu5hP7ANZmJAm@miclustercafe.ex7ag5u.mongodb.net/cafeDB', {
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
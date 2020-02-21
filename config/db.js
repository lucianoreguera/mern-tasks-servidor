const mongoose = require('mongoose');
require('dotenv').config({path: '.env'});

const conectarDB = async () => {
    mongoose.set('useCreateIndex', true);
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB Connect');
    } catch (error) {
        console.log(error);
        process.exit(1); // Detiene la app ante cualquier error
    }
};

module.exports = conectarDB;

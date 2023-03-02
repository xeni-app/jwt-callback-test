const mongoose = require('mongoose');

exports.connect = () => {
    const { MONGO_URI, MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;

    // Connecting to the database
    mongoose.connect(MONGO_URI, {
            user: MONGO_USER,
            pass: MONGO_PASSWORD,
            dbName: MONGO_DB,
        })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};

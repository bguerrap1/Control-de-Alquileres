const sql = require("mssql");
require("dotenv").config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    options:{
        encrypt: false,
        trustServerCertificate: true,

    },
    port: parseInt(process.env.DB_PORT)
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Conectado a la base de datos SQL Server");
        return pool;
    })
    .catch(error => {
        console.error("Error al conectar a la base de datos SQL Server:", error)
        throw error;
});

module.exports = {
    sql, poolPromise
};
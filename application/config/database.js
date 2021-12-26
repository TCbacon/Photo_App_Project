const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
    user: process.env.MYUSER,
    host: process.env.MYHOST,
    password: process.env.MYPASS,
    database: process.env.MYDB,
    port: process.env.MYPORT
}); 

module.exports = db.promise();
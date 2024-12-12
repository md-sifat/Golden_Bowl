const mysql = require('mysql2');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'restDB'
});

connection.connect((err) => {
    if(err)throw err;
    console.log('Connected to the Mysql database! ')
});

module.exports = connection;

const mysql = require('mysql')

/* CRIA A CONEXAO COM O BANCO DE DADOS */

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql2',
})

module.exports = pool
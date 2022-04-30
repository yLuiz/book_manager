const { response } = require('express')
const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (request, response) => {
  response.render('home')
})

/* ROTA POST PARA ADICIONAR LIVROS */
app.post('/books/insertbooks', (request, response) => {
  
  const title = request.body.title
  const pageqty = request.body.pageqty

  const insertQuery = `INSERT INTO books(??, ??) values (?, ?)`
  const data = ['title', 'pageqty', title, pageqty]

  pool.query(insertQuery, data, err => {
    if(err) {
      return console.log(err)
    }

    response.redirect('/')
  })
})

/* ROTA POST PARA ATUALIZAR INFORMAÇÕES DO LIVRO */
app.post('/books/updatebook/:id', (request, response) => {

  const id = request.params.id
  const title = request.body.title
  const pageqty = request.body.pageqty

  const updateQuery = `UPDATE books SET ??=?, ??=? WHERE ?? = ?`

  const data = ['title', title, 'pageqty', pageqty, 'id', id]

  pool.query(updateQuery, data, err => {
    if(err) return console.log(err)

    response.redirect(`/books/${id}`)
  })
})

/* ROTA POST PARA DELETAR LIVRO */
app.post('/books/deletebook/:id', (request, response) => {
  const id = request.params.id
  const deleteQuery = `DELETE FROM books WHERE ?? = ?`
  const data = ['id', id]
  
  pool.query(deleteQuery, data, err => {
    if(err) return console.log(err)

    response.redirect('/books')
  })
})

/* ROTA PARA VER LIVROS */
app.get('/books', (request, response) => {
  const selectQuery = `SELECT * from books`
  pool.query(selectQuery, (err, data) => {
    if(err) {
      return console.log(err)
    }

    const books = data

    response.render('books', { books })
  })
})

/* ROTA PARA VER INFORMÇÕES DE UM LIVRO ESPECIFICO DE ACORDO COM ID */
app.get('/books/:id', (request, response) => {
  const id = request.params.id
  const whereQuery = `SELECT * FROM books WHERE ?? = ?`
  const data = ['id', id]

  pool.query(whereQuery, data, (err, data) => {
    if(err) {
      return console.log(err)
    }

    const book = data[0]

    response.render('book', { book })
  })
})

/* ROTA PARA ATUALIZAR INFORMAÇÕES DO LIVRO */
app.get('/book/edit/:id', (request, response) => {

  const id = request.params.id
  const selectQuery = `SELECT * FROM books WHERE ?? = ?`
  const data = ['id', id]

  pool.query(selectQuery, data, (err, data) => {
    
    if(err) return console.log(err)

    const book = data[0]

    response.render('editbook', { book })
  })
})

app.listen(3000, err => {
  if (err) return console.log(err)

  console.log('Conectado ao MySQL!')
})
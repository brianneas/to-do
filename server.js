const express = require('express')
const sqlite3 = require('sqlite3')

const app = express()
const db = new sqlite3.Database('listDB.db')

app.use(express.json())

app.use(express.static('client'))

app.get('/list', (req, res) => {
  const query = 'SELECT item FROM list'

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Database error.', err })
      return
    }

    res.json(rows)
  })
})

app.post('/submit-item', (req, res) => {
  const item = req.body

  db.run('INSERT INTO list (item) VALUES (?);', item.item, err => {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        res.status(400).end('Activity item already exists in database.')
        return
      }

      res.status(500).json({ message: 'Database error.', err })
      return
    }

    res.end()
  })
})

app.post('/delete-item', (req, res) => {
  const item = req.body

  db.run('DELETE FROM list WHERE item=?', item.item, err => {
    if (err) {
      res.status(500).json({ message: 'Database error.', err })
      return
    }

    res.end()
  })
})


app.get('*', (req, res) => {
  res.status(404).end('Not found.')
})

app.listen(8080)

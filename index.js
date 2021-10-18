const { name } = require('ejs');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}));

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM todo');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/top', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/index', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM todo');
    const results = { 'items': (result) ? result.rows : null};
    res.render('pages/index', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/new', (req, res) => res.render('pages/new'));

app.post('/create', async (req, res) => {
  console.log( [req.body.itemName]);
  try {
    const client = await pool.connect()
    client.query('INSERT INTO todo (action) VALUES ($1)',
      [req.body.itemName],
      (error, results) => {
        res.redirect('/index');
        client.release();
      })
  }catch (err) {
  console.error(err);
  res.send("Error " + err);
  }
});

app.delete('/delete:id', async (req, res) => {
  
  try {
    const client = await pool.connect()
    client.query('DELETE FROM todo WHERE id = $2',
      [req.params.id],
      (error, results) => {
        res.redirect('/index');
        client.release();
      })
  }catch (err) {
  console.error(err);
  res.send("Error " + err);
  }
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


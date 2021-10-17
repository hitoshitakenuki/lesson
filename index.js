const { name } = require('ejs');
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();
app.use(express.urlencoded({extended: false}));

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
    const result = await client.query('SELECT * FROM test_table');
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
    const result = await client.query('SELECT * FROM test_table');
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
app.get('/index', (req, res) => res.render('pages/index'));
app.get('/new', (req, res) => res.render('pages/new'));
app.post('/create', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = client.query('INSERT INTO todo (name) VALUES ($1)',
      [name],
      (error, results) => {
        res.redirect('pages/index', result);
        client.release();
      });
  }catch (err) {
  console.error(err);
  res.send("Error " + err);
  }
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


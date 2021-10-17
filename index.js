const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();
const { Client } = require('pg');
var client = new Client({
  user: 'bxdhrqzeozmuws', 
  host: 'ec2-18-207-72-235.compute-1.amazonaws.com',
  database: 'd2umj76u4q9ods',
  password: '021af8e3cc3e2d38f94982afedd7741c6214e93fbb09d0400e1d8373120b233e', 
  post: 5432
})

client.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  client.query(
    'SELECT * FROM todo',
    (error, results) => {
      
      console.log(results);
      res.render('pages/top');
    }
  );
});
app.get('/index', (req, res) => res.render('pages/index'));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


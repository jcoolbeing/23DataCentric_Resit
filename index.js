// Required modules
const express = require('express');
//const mysql = require('mysql');
//const mongodb = require('mongodb').MongoClient;
const app = express();
/*
// MySQL connection
const mysqlConnection = mysql.createConnection({
  host     : 'localhost',
  user     : 'your_mysql_username',
  password : 'your_mysql_password',
  database : 'proj22'
});

mysqlConnection.connect(err => {
  if(err) throw err;
  console.log('Connected to MySQL DB');
});

// MongoDB connection
let mongoDb;
mongodb.connect('mongodb://localhost:27017/', (err, client) => {
  if(err) throw err;
  console.log('Connected to MongoDB');
  mongoDb = client.db('your_mongodb_name');
});

app.use(express.json()); // middleware for parsing JSON data

// Example route for getting data from MySQL
app.get('/mysqlData', (req, res) => {
  mysqlConnection.query('SELECT * FROM your_table', (err, results) => {
    if(err) throw err;
    res.send(results);
  });
});

// Example route for updating data in MySQL
app.post('/mysqlData', (req, res) => {
  let sql = `UPDATE your_table SET column1 = '${req.body.value1}', column2 = '${req.body.value2}' WHERE id = ${req.body.id}`;
  mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;
    res.send(results);
  });
});

// Example route for getting data from MongoDB
app.get('/mongoData', (req, res) => {
  mongoDb.collection('your_collection').find({}).toArray((err, results) => {
    if(err) throw err;
    res.send(results);
  });
});

// Example route for updating data in MongoDB
app.post('/mongoData', (req, res) => {
  let query = { _id: req.body._id };
  let newValues = { $set: { key: req.body.value } };
  mongoDb.collection('your_collection').updateOne(query, newValues, (err, results) => {
    if(err) throw err;
    res.send(results);
  });
});
*/
// Start the server
app.listen(3000, () => console.log('Server started on port 3000'));

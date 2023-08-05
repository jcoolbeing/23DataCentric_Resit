const express = require('express')
const mysql = require('mysql2');
const app = express()
const port = 3000

// setup ejs
app.set('view engine', 'ejs');

// connection pool
const pool = mysql.createPool({
  connectionLimit: 12,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'proj2022',
  waitForConnections: true,
  queueLimit: 0
});

// accesable using locals.db
app.locals.db = pool.promise();


// $$$$$$$$$$$$$$$$$$ ROUTES $$$$$$$$$$$$$$
// Route homepage
app.get('/', (req, res) => {
  res.render('index');
});

// Route Employees
app.get('/employees', async (req, res) => {
  try {
    // Fetch all employees from the database
    pool.query('SELECT * FROM employee', (err, results) => {
      if (err) {
        console.error('Error fetching employee data:', err);
        return res.status(500).json({ error: 'An error occurred while fetching data.' });
      }

      // checking if data is being accessed
      console.log(results);

      // send to view
      res.render('employees', { employees: results });
    });
  } catch (err) {
    console.error('Error rendering employees page:', err);
    res.status(500).json({ error: 'An error occurred while rendering the page.' });
  }
});

// Route Departments
app.get('/departments', (req, res) => {
  res.render('departments');
});

// Route Employees (MongoDB)
app.get('/employees-mongodb', (req, res) => {
  res.render('employees-mongodb');
});

// LISTENER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
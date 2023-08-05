const express = require('express')
const mysql = require('mysql2');
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Route for updating a employee
app.get('/employees/edit/:eid', (req, res) => {
  const eid = req.params.eid;
  // Fetch data from employee with eid
  pool.query('SELECT * FROM employee WHERE eid = ?', [eid], (err, result) => {
    if (err) {
      // database error
      console.error('Error fetching employee:', err);
      return res.status(500).send('Error fetching employee data');
    }

    if (result.length === 0) {
      // no employee with eid
      return res.status(404).send('Employee not found');
    }

    const employee = result[0]; 
    res.render('edit-employees', { employee });
  });
});

app.post('/employees/edit/:eid', (req, res) => {
  const { eid } = req.params;
  const { name, role, salary } = req.body;

  // alerting error for wrong input
  if (name.length < 5) {
    return res.status(400).send('Name must be at least 5 characters long.');
  }

  if (role !== 'Manager' && role !== 'Employee') {
    return res.status(400).send('Role must be either Manager or Employee.');
  }

  if (salary <= 0) {
    return res.status(400).send('Salary must be greater than 0.');
}
// SQL query to update the employee in the database
const sql = 'UPDATE employee SET ename = ?, role = ?, salary = ? WHERE eid = ?';
const values = [name, role, salary, eid];

pool.query(sql, values, (err, result) => {
  if (err) {
    console.error('Error updating employee:', err);
    return res.status(500).send('Error updating employee data');
  }

  // redirect back to employees
  res.redirect('/employees');
  });
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
});
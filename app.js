const express = require('express')
const mysql = require('mysql2');
const app = express()
const port = 3000
const empMongoData = require('./employeesDB.json');
const {MongoClient} = require('mongodb');
const uri = 'mongodb://localhost:27017';
// name for db because i will make it so if it dosnt exist it will create the db
const dbName = 'Proj2022';
let db;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// setup ejs
app.set('view engine', 'ejs');

// MYSQL
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


// MONGO_DB
// Create database if it doesn't exist
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('MongoDB connected');
    db = client.db(dbName);
    const collectionName = 'employees';

    // was encountering a error because it was adding json each time app restarts
    // so i chose this approach to make sure there are no duplicates
    // Iterate through the JSON data
    empMongoData.forEach((document) => {
      // Check if the _id already exists
      db.collection(collectionName).findOne({ _id: document._id }, (findErr, result) => {
        if (findErr) {
          console.error('Error finding document', findErr);
          return;
        }
        if (!result) {
          // If _id does not exist, insert the document
          db.collection(collectionName).insertOne(document, (insertErr, result) => {
            if (insertErr) {
              console.error('Error inserting document', insertErr);
            } else {
              console.log('Document inserted:', document._id);
            }
          });
        }
      });
    });
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
  });


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
  pool.query('SELECT * FROM dept', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Error fetching data.' });
    }

    // check to see if data is good
    console.log(results);

    // render in views folder
    res.render('departments', { departments: results });
  });
});


// Delete department
app.post('/departments/delete/:did', (req, res) => {
  const did = req.params.did;

  // Check to see if the dept has employees
  pool.query('SELECT * FROM emp_dept WHERE did = ?', [did], (err, results) => {
    if (err) {
      console.error('Error fetching data from emp_dept:', err);
      return res.status(500).send('Error fetching data from emp_dept');
    }
    // if dept has emps
    if (results.length > 0) {
      return res.render('department-delete', { did: did });
    }

    // No emps found therefore deleting dept.
    pool.query('DELETE FROM dept WHERE did = ?', [did], (err) => {
      if (err) {
        console.error('Error deleting department:', err);
        return res.status(500).send('Error deleting department');
      }

      // Redirect to departments page
      res.redirect('/departments');
    });
  });
});


// Route Employees (MongoDB)
app.get('/employees-mongodb', async (req, res) => {
  try {
    const collection = db.collection('employees');
    const employees = await collection.find().toArray();
    console.log(employees);
    res.render('employees-mongodb', { employees });
  } catch (err) {
    console.error(err);
    res.status(500).send('Couldnt retrieve data');
  }
});

// add employee route
app.get('/add-employees-mongodb', (req, res) => {
  res.render('add-employee-mongodb');
});

// post add employee route
app.post('/add-employees-mongodb', async (req, res) => {
  if (!db) {
    console.error('Database not connected');
    return res.status(500).send('Database not connected');
  }

  const collection = db.collection('employees');
  const { eid, phone, email } = req.body;

  // Validations
  if (eid.length !== 4) {
    return res.status(400).send('EID must be exactly 4 characters long.');
  }
  if (phone.length <= 5) {
    return res.status(400).send('Phone must be more than 5 characters long.');
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).send('Please enter a valid email address.');
  }

  // Check if EID already exists in MongoDB
  const existingEmployee = await collection.findOne({ _id: eid });
  if (existingEmployee) {
    return res.render('mongo-error', { message: `Error: ${eid} already exists.` });
  }

  // Check if EID exists in MySQL
  const [mysqlEmployees] = await pool.promise().query('SELECT * FROM employee WHERE eid = ?', [eid]);
  if (mysqlEmployees.length === 0) {
    return res.render('mysql-error', { message: `Error: ${eid} doesn't exist in MYSQL DB.` });
  }

  collection.insertOne({ _id: eid, phone, email }, (err, result) => {
    if (err) {
      console.error('Error inserting document', err);
      return res.status(500).send('Error adding employee');
    }

    // Redirect user back to mongo data
    res.redirect('/employees-mongodb');
  });
});


// LISTENER
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
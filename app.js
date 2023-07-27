const express = require('express')
const app = express()
const port = 3000

// setup ejs
app.set('view engine', 'ejs');

// ROUTES
// Route homepage
app.get('/', (req, res) => {
  res.render('index');
});

// Route Employees
app.get('/employees', (req, res) => {
  res.render('employees');
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
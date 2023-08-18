Employee Management System
    This program is built with Node.JS and utilizes MongoDB and MYSQL for databases.
It's functions include adding, editing, viewing, and deleting a employee's information
that is in the database.

Functions
View Employees: Lists all the employees from the MySQL database.
Edit Employees: Edit individual employee details in the MySQL database.
Add Employees (MongoDB): Add new employee information to the MongoDB database with specific validations.
View Employees (MongoDB): List all the employees from the MongoDB database.
Delete Departments: Delete department information from the MySQL database.

Requirements
Node.js (v14 or newer)
MySQL Server
MongoDB Server

Installation
Clone the Repository: Clone this repository to your local machine.
Install Dependencies: Run npm install inside the project directory to install all necessary dependencies.
Configure MySQL Connection: Make sure to set up your MySQL connection in the project. Change the user, password, host, and database to match your setup.
Configure MongoDB Connection: The MongoDB connection is set up to connect to mongodb://localhost:27017. If your MongoDB server is running elsewhere, please update the uri variable.
Start the Application: Run node app.js to start the application. The app will be available at http://localhost:3000.

Validations
When adding a new employee to the MongoDB database, the following validations are applied:

EID: Must be exactly 4 characters long.
Phone: Must be more than 5 characters long.
Email: Must be a valid email address.
Error handling is implemented for the scenarios where the EID already exists in MongoDB or does not exist in MySQL.
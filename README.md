Hii nxtwave team 
my selef prashanth 

this assignment is backend development node.js 

first the assignment started using node.js freamwork 
with in IDE (interated development environment) 
command od npm install init -y and etc 
1 installed some packages what that are necceary for this assignment 
2 created database like sqlite3 and created tables like Tasks and Users tables, 
3 inserted some peace of data in to the table 
4 after that connected to thae database like UserAndTasks.db database 
5 make API calls for the data to use and feacth the data in frentend 

Task Management API
This project implements a RESTful API for managing users and tasks using Express.js and SQLite. It provides endpoints for user registration, authentication, task creation, updating tasks, fetching tasks, and deleting tasks.




Assignment Overview
The assignment consists of building a Node.js application to manage tasks and users. Key features include:

User Registration: Allows users to register by providing a username, password, and email. Passwords are securely hashed using bcrypt before being stored in the database.
User Authentication: Users can authenticate using their username and password. JSON Web Tokens (JWT) are used for stateless authentication.
Task Management: Users can create, update, fetch, and delete tasks. Each task has attributes such as ID, title, description, assignee ID, status, creation timestamp, and update timestamp. 


Endpoints
POST /users/: Register a new user. Requires username, password, and email in the request body.
POST /login/: Authenticate a user. Requires username and password in the request body. Returns a JWT upon successful authentication.
GET /tasks/: Fetch all tasks. Requires a valid JWT in the Authorization header.
GET /tasks/:taskId: Fetch a specific task by ID. Requires a valid JWT in the Authorization header.
POST /tasks: Create a new task. Requires task details (ID, title, description, assignee ID, status, creation timestamp, and update timestamp) in the request body.
PUT /tasks/:taskId: Update an existing task by ID. Requires task details to be updated in the request body.
DELETE /tasks/:taskId: Delete a task by ID. 


Installation and Setup
Clone the repository.
Install dependencies using npm install.
Run the application using npm start.
Environment Variables
The following environment variables can be configured:

MY_JWT_TOKEN_SECRET: Secret key for JWT token generation.
DB_PATH: Path to the SQLite database file.
Dependencies
express: Web framework for Node.js.
sqlite: SQLite database driver for Node.js.
bcrypt: Library for hashing passwords securely.
jsonwebtoken: Library for JSON Web Token (JWT) generation and verification.

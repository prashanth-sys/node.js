const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "UserAndTasks.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//### GET tasks

app.get("/tasks/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      tasks
      ORDER BY
      id`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

//Create User API

app.post("/users/", async (request, response) => {
  const { username, password, email, id } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `
  SELECT 
  *
  FROM 
  users
  WHERE 
  username = "${username}"`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    // create user in users table
    const createUserQuery = `
   INSERT INTO 
    users(id,username,password,email)
    VALUES
    (
        "${id}",
        "${username}",
        "${hashedPassword}",
        "${email}"
    );`;
    await db.run(createUserQuery);
    response.send("User created successfully");
  } else {
    //return invalid user
    response.status(400);
    response.send("Username already exits");
  }
});

//User Login API
app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `
  SELECT 
  *
  FROM 
  users
  WHERE 
  username = "${username}"`;
  const dbUser = await db.get(selectUserQuery);
  if (dbUser === undefined) {
    //user doesn't exist
    response.status(400);
    response.send("Invalid user");
  } else {
    //compare password, hashed password
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, "MY_JWT_TOKE_SP");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

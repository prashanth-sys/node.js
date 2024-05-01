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

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid Access Token");
  } else {
    jwt.verify(jwtToken, "MY_JWT_TOKEN_SECRET", async (error, user) => {
      if (error) {
        response.status(401);
        response.send("Invalid Access Token");
      } else {
        next();
      }
    });
  }
};

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
        users(id, username, password, email)
      VALUES
        ("${id}", "${username}", "${hashedPassword}", "${email}")`;
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
      const jwtToken = jwt.sign(payload, "MY_JWT_TOKEN_SECRET");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

//### GET tasks
app.get("/tasks/", authenticateToken, async (request, response) => {
  const getBooksQuery = `
        SELECT
           *
        FROM
           tasks
        ORDER BY
           id`;
  const tasksArray = await db.all(getBooksQuery);
  response.send(tasksArray);
});

// GET Task ID

app.get("/tasks/:taskId", async (request, response) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid Access Token");
  } else {
    jwt.verify(jwtToken, "MY_JWT_TOKEN_SECRET", async (error, user) => {
      if (error) {
        response.status(401);
        response.status("Invalid Access Token");
      } else {
        const { taskId } = request.params;
        const getBooksQuery = `
        SELECT
           *
        FROM
           tasks
        WHERE 
        id = ${taskId}`;
        const task = await db.get(getBooksQuery);
        response.send(task);
      }
    });
  }
});

// POST API

// POST API
app.post("/tasks", async (request, response) => {
  const taskDetails = request.body;
  const {
    id,
    title,
    description,
    assigneeId,
    status,
    createdAt,
    updatedAt,
  } = taskDetails;
  const addTaskQuery = `
    INSERT INTO Tasks(id, title, description, assignee_id, status, created_at, updated_at)
    VALUES
    ("${id}", "${title}", "${description}", "${assigneeId}", "${status}", "${createdAt}", "${updatedAt}");
    `;
  const dbResponse = await db.run(addTaskQuery);
  response.send("Updated Successfully");
});

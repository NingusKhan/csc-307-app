import express from "express";
import cors from "cors";

const users = {
  users_list: [
    { id: "xyz789", name: "Charlie", job: "Janitor" },
    { id: "abc123", name: "Mac", job: "Bouncer" },
    { id: "ppp222", name: "Mac", job: "Professor" },
    { id: "yat999", name: "Dee", job: "Aspiring actress" },
    { id: "zap555", name: "Dennis", job: "Bartender" }
  ]
};

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const findUserByName = (name) => {
  return users["users_list"].filter(user => user.name === name);
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

const findUserById = (id) => {
  return users["users_list"].find(user => user.id === id); //used find bc user ID is unique
};

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const removeUser = (user) => {
  const index = users["users_list"].findIndex(u => u.id === user.id);
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true; // Successfully removed
  } else {
    return false; // User not found
  }
};

const generateId = () => {
  return Math.random().toString(36).substr(2, 9); // Generates a random string of 9 characters
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name && job) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateId();
  const addedUser = addUser(userToAdd);
  res.status(201).send(addedUser);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = { id };
  const result = removeUser(user);
  if (result) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  let result = findUserById(id);
  if (!result) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// GET /users to fetch all users or filter by name and/or job
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  userService.getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((err) => {
      res.status(500).send("Error fetching users");
    });
});

// POST /users to create and insert a new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;

  userService.addUser(userToAdd)
    .then((addedUser) => {
      res.status(201).send(addedUser);
    })
    .catch((err) => {
      res.status(500).send("Error adding user");
    });
});

// DELETE /users/:id to remove a user by their ID
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  userService.findUserByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.sendStatus(204); // Successfully deleted
      } else {
        res.sendStatus(404); // User not found
      }
    })
    .catch((err) => {
      res.status(500).send("Error deleting user");
    });
});

// GET /users/:id to fetch a user by ID
app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  userService.findUserById(id)
    .then((result) => {
      if (!result) {
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch((err) => {
      res.status(500).send("Error fetching user");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
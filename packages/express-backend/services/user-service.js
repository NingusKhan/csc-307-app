import mongoose from "mongoose";
import userModel from "../models/user.js";

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getUsers(name, job) {
  let query = {};

  if (name) {
    query.name = name;
  }

  if (job) {
    query.job = job;
  }

  return userModel.find(query);
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

// Implementing findUserByIdAndDelete
function findUserByIdAndDelete(id) {
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByIdAndDelete, // Exporting the new function
};

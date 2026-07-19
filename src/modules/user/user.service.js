const { ObjectId } = require("mongodb");
const { usersCollection } = require("../../lib/db");

const upsertUser = async (userData) => {
  userData.created_at = new Date().toString();
  userData.last_loggedIn = new Date().toString();
  if (!userData.role) userData.role = "student";

  const query = { email: userData.email };
  const existing = await usersCollection.findOne(query);
  if (existing) {
    return usersCollection.updateOne(query, {
      $set: { last_loggedIn: new Date().toString() },
    });
  }
  return usersCollection.insertOne(userData);
};

const getUserRole = (email) => usersCollection.findOne({ email });

const getTutors = () => usersCollection.find({ role: "tutor" }).toArray();

const getLatestTutors = () =>
  usersCollection.find({ role: "tutor" }).sort({ created_at: -1 }).limit(6).toArray();

const getTutorById = (id) =>
  usersCollection.findOne({ _id: new ObjectId(id) });

const getAllUsers = () =>
  usersCollection.find().sort({ created_at: -1 }).toArray();

const getUserById = (id) =>
  usersCollection.findOne({ _id: new ObjectId(id) });

const updateUser = (id, data) =>
  usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });

const deleteUser = (id) =>
  usersCollection.deleteOne({ _id: new ObjectId(id) });

module.exports = {
  upsertUser,
  getUserRole,
  getTutors,
  getLatestTutors,
  getTutorById,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

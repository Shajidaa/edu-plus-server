const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db("eduPlusDB");

module.exports = {
  db,
  usersCollection: db.collection("users"),
  tuitionCollection: db.collection("tuitions"),
  applicationsCollection: db.collection("applications"),
  paymentsCollection: db.collection("payments"),
};

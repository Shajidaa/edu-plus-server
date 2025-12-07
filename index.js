const express = require("express");
var cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3000;

const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    console.log(decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Unauthorized Access!", err });
  }
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("eduPlusDB");
    const usersCollection = db.collection("users");
    const tuitionCollection = db.collection("tuitions");

    //user api
    app.post("/users", async (req, res) => {
      try {
        const userData = req.body;
        userData.created_at = new Date().toString();
        userData.last_loggedIn = new Date().toString();
        const query = {
          email: userData.email,
        };
        const alreadyExists = await usersCollection.findOne(query);
        if (alreadyExists) {
          const result = await usersCollection.updateOne(query, {
            $set: {
              last_loggedIn: new Date().toString(),
            },
          });
          return res.send(result);
        }
        const result = await usersCollection.insertOne(userData);
        res.send(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
    //user get by role

    app.get("/user/role", async (req, res) => {
      const result = await usersCollection.findOne();
    });
    //tuitions apis
    app.post("/tuitions", async (req, res) => {
      const tuitionsData = req.body;
      console.log(tuitionsData);
      const result = await tuitionCollection.insertOne(tuitionsData);
      res.send(result);
    });

    app.get("/tuitions", async (req, res) => {
      const result = await tuitionCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");
var cors = require("cors");
const app = express();
const port = 3000;

// mongodb+srv://<db_username>:<db_password>@cluster0.xodph41.mongodb.net/?appName=Cluster0

const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://eduPlus:bSYLRujYfiGipESD@cluster0.xodph41.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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
        const result = await usersCollection.insertOne(userData);
        res.send(result);
      } catch (error) {}
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

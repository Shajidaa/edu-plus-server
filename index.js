const express = require("express");
var cors = require("cors");
require("dotenv").config();
const admin = require("firebase-admin");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf-8"
);
const serviceAccount = JSON.parse(decoded);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN,
    credentials: true,
  })
);

app.use(express.json());

const verifyJWT = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  console.log("token-->", token);
  if (!token) return res.status(401).send({ message: "Unauthorized Access!" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.tokenEmail = decoded.email;
    console.log("decoded ----->", decoded);
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Unauthorized Access!", err });
  }
};

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

    // ******************role middlewares**************//

    const verifyStudent = async (req, res, next) => {
      const email = req.tokenEmail;
      console.log(email);

      const user = await usersCollection.findOne({ email });
      if (user?.role !== "student") {
        return res
          .status(403)
          .send({ message: "Student only go!", role: user?.role });
      }
      next();
    };
    const verifyAdmin = async (req, res, next) => {
      const email = req.tokenEmail;
      console.log(email);

      const user = await usersCollection.findOne({ email });
      if (user?.role !== "admin") {
        return res
          .status(403)
          .send({ message: "admin only go!", role: user?.role });
      }
      next();
    };

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

    app.get("/user/role", verifyJWT, async (req, res) => {
      const result = await usersCollection.findOne({ email: req.tokenEmail });
      // console.log("user role ------>", result);

      res.send({ role: result?.role });
    });

    // ********************* all tuitions get*************//

    app.get("/all-tuitions", async (req, res) => {
      const isAdmin = req.query.admin === "true";
      const filter = isAdmin ? {} : { status: "approved" };
      const result = await tuitionCollection
        .find(filter)
        .sort({ created_at: -1 })
        .toArray();
      res.send(result);
    });

    // *********************tuitions apis status update*************//

    app.patch("/tuition-status/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      try {
        const result = await tuitionCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: status } }
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true });
        } else {
          res.send({ success: false, message: "No document updated" });
        }
      } catch (error) {
        res.status(500).send({ success: false, message: error.message });
      }
    });

    // *********************tuitions apis post*************//
    app.post("/tuitions", verifyJWT, verifyStudent, async (req, res) => {
      const tuitionsData = req.body;
      tuitionsData.status = "pending";
      // console.log(tuitionsData);
      const result = await tuitionCollection.insertOne(tuitionsData);
      res.send(result);
    });
    // *********************tuitions apis get*************//
    app.get("/tuitions", verifyJWT, verifyStudent, async (req, res) => {
      const email = req.tokenEmail;
      const result = await tuitionCollection
        .find({
          studentEmail: email,
        })
        .toArray();
      res.send(result);
    });
    // *********************tuitions apis update*************//
    app.patch("/tuitions/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const result = await tuitionCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      res.send(result);
    });

    // *********************tuitions apis delete*************//
    app.delete("/tuitions/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tuitionCollection.deleteOne(query);

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

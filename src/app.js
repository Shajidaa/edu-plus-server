const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Firebase init
require("./config/firebase");

const app = express();

app.use(cors({ origin: process.env.CLIENT_DOMAIN, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/", require("./modules/user/user.route"));
app.use("/", require("./modules/tuition/tuition.route"));
app.use("/", require("./modules/application/application.route"));
app.use("/", require("./modules/payment/payment.route"));
app.use("/", require("./modules/ai/ai.route"));

module.exports = app;

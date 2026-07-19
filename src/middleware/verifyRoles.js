const { usersCollection } = require("../lib/db");

const verifyStudent = async (req, res, next) => {
  const user = await usersCollection.findOne({ email: req.tokenEmail });
  if (user?.role !== "student")
    return res.status(403).send({ message: "Student only go!", role: user?.role });
  next();
};

const verifyTutor = async (req, res, next) => {
  const user = await usersCollection.findOne({ email: req.tokenEmail });
  if (user?.role !== "tutor")
    return res.status(403).send({ message: "tutor only go!", role: user?.role });
  next();
};

const verifyAdmin = async (req, res, next) => {
  const user = await usersCollection.findOne({ email: req.tokenEmail });
  if (user?.role !== "admin")
    return res.status(403).send({ message: "admin only go!", role: user?.role });
  next();
};

module.exports = { verifyStudent, verifyTutor, verifyAdmin };

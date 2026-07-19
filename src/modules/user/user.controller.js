const service = require("./user.service");

const upsertUser = async (req, res) => {
  try {
    const result = await service.upsertUser(req.body);
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserRole = async (req, res) => {
  const user = await service.getUserRole(req.tokenEmail);
  res.send({ role: user?.role });
};

const getTutors = async (req, res) => {
  try {
    res.send(await service.getTutors());
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch tutors" });
  }
};

const getLatestTutors = async (req, res) => {
  try {
    res.send(await service.getLatestTutors());
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch tutors" });
  }
};

const getTutorById = async (req, res) => {
  try {
    res.send(await service.getTutorById(req.params.id));
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch tutor" });
  }
};

const getAllUsers = async (req, res) => {
  res.send(await service.getAllUsers());
};

const getUserById = async (req, res) => {
  res.send(await service.getUserById(req.params.id));
};

const updateUser = async (req, res) => {
  res.send(await service.updateUser(req.params.id, req.body));
};

const deleteUser = async (req, res) => {
  res.send(await service.deleteUser(req.params.id));
};

module.exports = {
  upsertUser, getUserRole, getTutors, getLatestTutors,
  getTutorById, getAllUsers, getUserById, updateUser, deleteUser,
};

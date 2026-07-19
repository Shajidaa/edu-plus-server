const service = require("./tuition.service");

const getAllTuitions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { class: className, subject, location } = req.query;
    const isAdmin = req.query.admin === "true";
    const filter = isAdmin ? {} : { status: "approved" };
    if (className) filter.tuitionClass = className;
    if (subject) filter.tuitionSubject = subject;
    if (location) filter.location = location;
    res.send(await service.getPaginatedTuitions(filter, page, limit));
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const getAllTuitionsAdmin = async (req, res) => {
  const filter = req.query.admin === "true" ? {} : { status: "approved" };
  res.send(await service.getAllTuitionsFiltered(filter));
};

const getAllTuitionPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.admin === "true" ? {} : { status: "approved" };
    res.send(await service.getPaginatedTuitions(filter, page, limit));
  } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

const getLatestTuitions = async (req, res) => {
  const filter = req.query.admin === "true" ? {} : { status: "approved" };
  res.send(await service.getLatestTuitions(filter));
};

const getTuitionById = async (req, res) => {
  try {
    const result = await service.getTuitionById(req.params.id);
    if (!result) return res.status(404).send({ message: "Tuition not found" });
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
};

const updateTuitionStatus = async (req, res) => {
  try {
    const result = await service.updateTuitionStatus(req.params.id, req.body.status);
    res.send({ success: result.modifiedCount > 0 });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const createTuition = async (req, res) => {
  res.send(await service.createTuition(req.body));
};

const getStudentTuitions = async (req, res) => {
  res.send(await service.getStudentTuitions(req.tokenEmail, req.query.status));
};

const updateTuition = async (req, res) => {
  res.send(await service.updateTuition(req.params.id, req.body));
};

const deleteTuition = async (req, res) => {
  res.send(await service.deleteTuition(req.params.id));
};

module.exports = {
  getAllTuitions, getAllTuitionsAdmin, getAllTuitionPaginated, getLatestTuitions,
  getTuitionById, updateTuitionStatus, createTuition,
  getStudentTuitions, updateTuition, deleteTuition,
};

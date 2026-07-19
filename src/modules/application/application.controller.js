const service = require("./application.service");

const createApplication = async (req, res) => {
  try {
    const result = await service.createApplication(req.body, req.tokenEmail);
    res.send({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to submit application" });
  }
};

const getTutorApplications = async (req, res) => {
  res.send(await service.getTutorApplications(req.tokenEmail));
};

const getStudentApplications = async (req, res) => {
  res.send(await service.getStudentApplications(req.tokenEmail));
};

const getApplicationById = async (req, res) => {
  res.send(await service.getApplicationById(req.params.id));
};

const updateApplicationStatus = async (req, res) => {
  res.send(await service.updateApplicationStatus(req.params.id, req.body.status));
};

const getTutorOngoingTuitions = async (req, res) => {
  res.send(await service.getTutorOngoingTuitions(req.tokenEmail));
};

module.exports = {
  createApplication, getTutorApplications, getStudentApplications,
  getApplicationById, updateApplicationStatus, getTutorOngoingTuitions,
};

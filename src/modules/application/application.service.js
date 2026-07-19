const { ObjectId } = require("mongodb");
const { applicationsCollection } = require("../../lib/db");

const createApplication = (data, email) => {
  data.appliedAt = new Date();
  data.applicantEmail = email;
  data.status = "pending";
  return applicationsCollection.insertOne(data);
};

const getTutorApplications = (email) =>
  applicationsCollection.find({ tutorEmail: email }).toArray();

const getStudentApplications = (email) =>
  applicationsCollection.find({ studentEmail: email }).toArray();

const getApplicationById = (id) =>
  applicationsCollection.findOne({ _id: new ObjectId(id) });

const updateApplicationStatus = (id, status) =>
  applicationsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });

const getTutorOngoingTuitions = (email) =>
  applicationsCollection.find({ tutorEmail: email, status: "approved" }).toArray();

module.exports = {
  createApplication, getTutorApplications, getStudentApplications,
  getApplicationById, updateApplicationStatus, getTutorOngoingTuitions,
};

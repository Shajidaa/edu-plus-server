const { ObjectId } = require("mongodb");
const { tuitionCollection } = require("../../lib/db");

const getPaginatedTuitions = async (query, page, limit) => {
  const skip = (page - 1) * limit;
  const total = await tuitionCollection.countDocuments(query);
  const tuitions = await tuitionCollection
    .find(query).sort({ created_at: -1 }).skip(skip).limit(limit).toArray();
  return { success: true, total, page, limit, totalPages: Math.ceil(total / limit), tuitions };
};

const getAllTuitionsFiltered = async (query) =>
  tuitionCollection.find(query).sort({ created_at: -1 }).toArray();

const getLatestTuitions = (query) =>
  tuitionCollection.find(query).sort({ created_at: -1 }).limit(6).toArray();

const getTuitionById = (id) =>
  tuitionCollection.findOne({ _id: new ObjectId(id) });

const updateTuitionStatus = (id, status) =>
  tuitionCollection.updateOne({ _id: new ObjectId(id) }, { $set: { status } });

const createTuition = (data) => {
  data.status = "pending";
  data.created_at = new Date();
  return tuitionCollection.insertOne(data);
};

const getStudentTuitions = (email, status) => {
  const query = { studentEmail: email };
  if (status) query.status = status;
  return tuitionCollection.find(query).toArray();
};

const updateTuition = (id, data) =>
  tuitionCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });

const deleteTuition = (id) =>
  tuitionCollection.deleteOne({ _id: new ObjectId(id) });

module.exports = {
  getPaginatedTuitions, getAllTuitionsFiltered, getLatestTuitions,
  getTuitionById, updateTuitionStatus, createTuition,
  getStudentTuitions, updateTuition, deleteTuition,
};

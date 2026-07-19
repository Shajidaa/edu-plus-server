const service = require("./payment.service");

const createCheckoutSession = async (req, res) => {
  const { price, tuitionId } = req.body;
  if (!price || !tuitionId) return res.status(400).send({ message: "Invalid payment data" });
  const session = await service.createCheckoutSession(req.body);
  res.send({ url: session.url });
};

const paymentSuccess = async (req, res) => {
  try {
    const result = await service.handlePaymentSuccess(req.body.sessionId);
    if (result.alreadyExists)
      return res.send({ message: "already exists", transactionId: result.transactionId });
    res.send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: "Payment verification failed" });
  }
};

const getStudentPayments = async (req, res) => {
  res.send(await service.getStudentPayments(req.tokenEmail));
};

const getTutorPayments = async (req, res) => {
  res.send(await service.getTutorPayments(req.tokenEmail));
};

const getAllPayments = async (req, res) => {
  res.send(await service.getAllPayments());
};

module.exports = {
  createCheckoutSession, paymentSuccess,
  getStudentPayments, getTutorPayments, getAllPayments,
};

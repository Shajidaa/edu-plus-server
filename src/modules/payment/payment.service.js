const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { paymentsCollection, applicationsCollection } = require("../../lib/db");

const createCheckoutSession = ({ price, tuitionId, tutorEmail, tutorName, studentEmail, subject }) =>
  stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: studentEmail,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Tuition Payment - ${subject}`,
            description: `Tutor: ${tutorName}`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: { tuitionId, tutorEmail, studentEmail, subject },
    success_url: `${process.env.CLIENT_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_DOMAIN}/dashboard/applied-tutors`,
  });

const handlePaymentSuccess = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const transactionId = session.payment_intent;

  const existing = await paymentsCollection.findOne({ transactionId });
  if (existing) return { alreadyExists: true, transactionId };

  if (session.payment_status !== "paid") return { success: false };

  const { tuitionId, tutorEmail, studentEmail, subject } = session.metadata;

  const updateResult = await applicationsCollection.updateOne(
    { _id: new ObjectId(tuitionId) },
    { $set: { status: "paid" } }
  );

  const paymentInfo = {
    tuitionId, tutorEmail, studentEmail, subject, transactionId,
    amount: session.amount_total / 100,
    currency: session.currency,
    paymentStatus: session.payment_status,
    paidAt: new Date(),
  };

  const paymentInsert = await paymentsCollection.insertOne(paymentInfo);
  return { success: true, modifyApplication: updateResult, transactionId, paymentInfo: paymentInsert };
};

const getStudentPayments = (email) =>
  paymentsCollection.find({ studentEmail: email }).toArray();

const getTutorPayments = (email) =>
  paymentsCollection.find({ tutorEmail: email }).toArray();

const getAllPayments = () => paymentsCollection.find().toArray();

module.exports = {
  createCheckoutSession, handlePaymentSuccess,
  getStudentPayments, getTutorPayments, getAllPayments,
};

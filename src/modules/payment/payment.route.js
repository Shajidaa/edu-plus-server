const express = require("express");
const router = express.Router();
const ctrl = require("./payment.controller");
const verifyJWT = require("../../middleware/verifyJWT");
const { verifyAdmin, verifyTutor } = require("../../middleware/verifyRoles");

router.post("/create-checkout-session", ctrl.createCheckoutSession);
router.post("/payment-success", ctrl.paymentSuccess);
router.get("/payment", verifyJWT, ctrl.getStudentPayments);
router.get("/payment-tutor", verifyJWT, verifyTutor, ctrl.getTutorPayments);
router.get("/all-payment", verifyJWT, verifyAdmin, ctrl.getAllPayments);

module.exports = router;

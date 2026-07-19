const express = require("express");
const router = express.Router();
const ctrl = require("./application.controller");
const verifyJWT = require("../../middleware/verifyJWT");
const { verifyTutor } = require("../../middleware/verifyRoles");

router.post("/applications", verifyJWT, ctrl.createApplication);
router.get("/applications", verifyJWT, verifyTutor, ctrl.getTutorApplications);
router.get("/my-applications", verifyJWT, ctrl.getStudentApplications);
router.get("/my-applications/:id", verifyJWT, ctrl.getApplicationById);
router.patch("/applications/status/:id", verifyJWT, ctrl.updateApplicationStatus);
router.get("/tutor-ongoing-tuitions", verifyJWT, verifyTutor, ctrl.getTutorOngoingTuitions);

module.exports = router;

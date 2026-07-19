const express = require("express");
const router = express.Router();
const ctrl = require("./tuition.controller");
const verifyJWT = require("../../middleware/verifyJWT");
const { verifyStudent } = require("../../middleware/verifyRoles");

router.get("/all-tuitions", ctrl.getAllTuitions);
router.get("/all-tuitions-admin", ctrl.getAllTuitionsAdmin);
router.get("/all-tuition", ctrl.getAllTuitionPaginated);
router.get("/latest-tuitions", ctrl.getLatestTuitions);
router.get("/tuitions-details/:id", ctrl.getTuitionById);
router.patch("/tuition-status/:id", ctrl.updateTuitionStatus);

router.post("/tuitions", verifyJWT, verifyStudent, ctrl.createTuition);
router.get("/tuitions", verifyJWT, verifyStudent, ctrl.getStudentTuitions);
router.patch("/tuitions/:id", verifyJWT, verifyStudent, ctrl.updateTuition);
router.delete("/tuitions/:id", ctrl.deleteTuition);

module.exports = router;

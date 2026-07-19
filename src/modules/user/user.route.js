const express = require("express");
const router = express.Router();
const ctrl = require("./user.controller");
const verifyJWT = require("../../middleware/verifyJWT");
const { verifyAdmin } = require("../../middleware/verifyRoles");

router.post("/users", ctrl.upsertUser);
router.get("/user/role", verifyJWT, ctrl.getUserRole);
router.get("/tutors", ctrl.getTutors);
router.get("/latest-tutors", ctrl.getLatestTutors);
router.get("/tutors/:id", ctrl.getTutorById);

// Admin
router.get("/all-users", verifyJWT, verifyAdmin, ctrl.getAllUsers);
router.get("/users-details/:id", verifyJWT, verifyAdmin, ctrl.getUserById);
router.patch("/users/:id", verifyJWT, verifyAdmin, ctrl.updateUser);
router.delete("/users/:id", verifyJWT, verifyAdmin, ctrl.deleteUser);

module.exports = router;

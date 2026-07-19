const express = require("express");
const router = express.Router();
const { ask, chat } = require("./ai.controller");

router.post("/ai-ask", ask);
router.post("/ai-chat", chat);

module.exports = router;

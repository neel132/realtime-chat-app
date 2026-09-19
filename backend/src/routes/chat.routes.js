const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const chatController = require("../controllers/chat.controller");

router.use(authenticate);

router.get("/users", chatController.getUsers);
router.get("/messages", chatController.getMessages);
router.post("/messages", chatController.sendMessage);

module.exports = router;
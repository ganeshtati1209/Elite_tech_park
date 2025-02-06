const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const { getUsers } = require("../controllers/userController"); // ✅ Ensure this import is correct

const router = express.Router();

router.get("/", authenticateUser, authorizeRoles("admin"), getUsers); // ✅ Ensure `getUsers` is defined

module.exports = router;

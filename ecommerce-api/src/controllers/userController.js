const User = require("../models/User");

// Get All Users (Admin Only)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

module.exports = { getUsers }; // ✅ Ensure `getUsers` is correctly exported

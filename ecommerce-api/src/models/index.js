const { sequelize } = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Set force: true to reset DB on each restart
    console.log("✅ Database Synced Successfully");
  } catch (error) {
    console.error("❌ Database Sync Error:", error);
  }
};

module.exports = { syncDatabase, User, Product };

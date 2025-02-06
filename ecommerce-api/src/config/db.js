const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../ecommerce.sqlite"), // SQLite file
  logging: false, // Disable SQL logs in console
});

// Connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ SQLite Database Connected Successfully!");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
  }
};

module.exports = { sequelize, connectDB };

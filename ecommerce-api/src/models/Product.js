const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  oldPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  newPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discountPercentage: {
    type: DataTypes.VIRTUAL,
    get() {
      return ((this.oldPrice - this.newPrice) / this.oldPrice) * 100;
    },
  },
  discountAmount: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.oldPrice - this.newPrice;
    },
  },
  scheduledStartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  freeDelivery: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deliveryAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  productURL: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  imageUrl: {
    type: DataTypes.STRING, // Cloudinary image URL
    allowNull: false,
  },
});


Product.belongsTo(User, { foreignKey: "vendorId", as: "vendor" });

module.exports = Product;

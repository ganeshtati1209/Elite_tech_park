const { Op } = require("sequelize");
const Product = require("../models/Product");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Create Product (Admin, Staff, Vendor)
const createProduct = async (req, res) => {
  try {
    const { name, description, category, oldPrice, newPrice, scheduledStartDate, freeDelivery, deliveryAmount } = req.body;
    const vendorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    // Calculate expiry date (7 days from scheduled start date)
    const expiryDate = new Date(scheduledStartDate);
    expiryDate.setDate(expiryDate.getDate() + 7);

    const newProduct = await Product.create({
      name,
      description,
      category,
      oldPrice,
      newPrice,
      scheduledStartDate,
      expiryDate,
      freeDelivery,
      deliveryAmount,
      productURL: `${name.replace(/\s+/g, "-")}-${Date.now()}`,
      imageUrl: uploadResult.secure_url,
      vendorId,
    });

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: User, as: "vendor", attributes: ["id", "name", "email"] },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: { model: User, as: "vendor", attributes: ["id", "name", "email"] },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// Delete Product (Admin, Vendor, Staff)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Only Admin or Owner (Vendor) can delete
    if (req.user.role !== "admin" && req.user.id !== product.vendorId) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Search, Filter & Paginate Products
const searchProducts = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let whereCondition = {};

    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` };
    }
    if (category) {
      whereCondition.category = category;
    }
    if (minPrice && maxPrice) {
      whereCondition.newPrice = { [Op.between]: [minPrice, maxPrice] };
    }

    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      where: whereCondition,
      include: { model: User, as: "vendor", attributes: ["id", "name", "email"] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      totalProducts: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page),
      products: products.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error searching products", error });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, deleteProduct, searchProducts };

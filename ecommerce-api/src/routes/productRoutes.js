const express = require("express");
const { createProduct, getAllProducts, getProductById, deleteProduct, searchProducts } = require("../controllers/productController");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", authenticateUser, authorizeRoles("admin", "vendor", "staff"), upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", authenticateUser, authorizeRoles("admin", "vendor", "staff"), deleteProduct);
router.get("/search", searchProducts);

module.exports = router; // ✅ Ensure ONLY `router` is exported

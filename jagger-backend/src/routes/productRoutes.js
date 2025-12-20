const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, role("admin", "manager"), getProducts);
router.post("/", auth, role("admin"), createProduct);
router.get("/:id", auth, role("admin"), getProduct);
router.put("/:id", auth, role("admin"), updateProduct);
router.delete("/:id", auth, role("admin"), deleteProduct);

module.exports = router;

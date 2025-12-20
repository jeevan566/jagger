const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  deleteCategory
} = require("../controllers/categoryController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

router.get("/", auth, role("admin"), getCategories);
router.post("/", auth, role("admin"), createCategory);
router.delete("/:id", auth, role("admin"), deleteCategory);

module.exports = router;

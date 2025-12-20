const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
// const { uploadSupplierDocs } = require("../controllers/supplierController");


const {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  changeStatus,
  uploadSupplierDocs,
} = require("../controllers/supplierController");

const auth = require("../middlewares/auth");
const role = require("../middlewares/role");

// ADMIN ONLY
router.get("/", auth, role("admin", "manager"), getSuppliers);
router.post("/", auth, role("admin"), createSupplier);
router.get("/:id", auth, role("admin"), getSupplierById);
router.put("/:id", auth, role("admin"), updateSupplier);
router.delete("/:id", auth, role("admin"), deleteSupplier);
router.post("/upload-docs/:id", auth, role("admin"), upload.array("files"), uploadSupplierDocs);

// APPROVE / REJECT
router.put("/:id/status", auth, role("admin"), changeStatus);

module.exports = router;

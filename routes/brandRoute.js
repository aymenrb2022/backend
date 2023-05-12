const express = require("express");
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
} = require("../controller/brandCtrl");
const { autheMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", autheMiddleware, isAdmin, createBrand);
router.put("/:id", autheMiddleware, isAdmin, updateBrand);
router.delete("/:id",autheMiddleware, isAdmin, deleteBrand);
router.get("/:id", getBrand);
router.get("/", getallBrand);

module.exports = router;

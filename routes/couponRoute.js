const express = require("express");
const {
  createCoupon,
  getallCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponCtrl");
const { autheMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", autheMiddleware, isAdmin, createCoupon);
router.get("/", autheMiddleware, isAdmin, getallCoupon);
router.get("/:id", autheMiddleware, isAdmin, getallCoupon);
router.put("/:id", autheMiddleware, isAdmin, updateCoupon);
router.delete("/:id", autheMiddleware, isAdmin, deleteCoupon);

module.exports = router;

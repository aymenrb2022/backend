const express = require("express");
const {
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getEnquiry,
  getallEnquiry,
} = require("../controller/enqCntrl");
const { autheMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", createEnquiry);
router.put("/:id", autheMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", autheMiddleware, isAdmin, deleteEnquiry);
router.get("/:id", getEnquiry);
router.get("/", getallEnquiry);

module.exports = router;

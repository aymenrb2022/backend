const express = require("express");
const router = express.Router();
const {uploadImages , deleteImages} = require("../controller/uploadCtrl");
const {autheMiddleware,isAdmin} = require ("../middlewares/authMiddleware")
const {uploadPhoto,productImgResize} = require ("../middlewares/uploadImage")


router.post("/",autheMiddleware,isAdmin,uploadPhoto.array("images",10),productImgResize,uploadImages );
router.delete("/delete/:id",autheMiddleware,isAdmin,deleteImages);


module.exports = router ;
const express = require('express');
const { createColor,updateColor,deleteColor,getColor,getallColor} = require('../controller/colorCntrl');
const router = express.Router() ;
const {autheMiddleware,isAdmin} = require ("../middlewares/authMiddleware");

router.post ("/",autheMiddleware,isAdmin,createColor);
router.put ("/:id",autheMiddleware,isAdmin,updateColor);
router.delete("/:id",autheMiddleware,isAdmin,deleteColor);
router.get("/:id",getColor);
router.get("/",getallColor);
module.exports = router ;
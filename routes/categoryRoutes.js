const express = require('express');
const { createCategory,updateCategory,deleteCategory,getCategory,getallCategory} = require('../controller/categoryCntrl');
const router = express.Router() ;
const {autheMiddleware,isAdmin} = require ("../middlewares/authMiddleware");

router.post ("/",autheMiddleware,isAdmin,createCategory);
router.put ("/:id",autheMiddleware,isAdmin,updateCategory);
router.delete("/:id",autheMiddleware,isAdmin,deleteCategory);
router.get("/:id",getCategory);
router.get("/",getallCategory);
module.exports = router ;
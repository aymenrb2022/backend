const express = require("express");
const {createProduct,
    getProduct,
    getallProduct,
    updateProduct,
    deleteProduct,
    Addwishlist,
    rating,
  } = require("../controller/productCtrl");
const router = express.Router();
const {autheMiddleware,isAdmin} = require ("../middlewares/authMiddleware")



router.post("/",autheMiddleware,isAdmin,createProduct);
router.get("/:id",getProduct);
router.put("/:id",autheMiddleware,isAdmin,updateProduct);
router.put('/addwishlist',autheMiddleware,Addwishlist);

router.post('/rating',autheMiddleware,rating);
router.delete("/:id",autheMiddleware,isAdmin,deleteProduct);
router.get("/",getallProduct);

module.exports = router ;
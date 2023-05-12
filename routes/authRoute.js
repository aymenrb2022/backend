const express = require('express');
const router = express.Router() ;
const {createUser,
     loginUserCtrl,
     getalluser,
     getUser,
     deleteuser,
     updateuser,
     blockuser,
     unblockuser,
     handleRefreshToken,
     logout,
     updatePassword ,
     loginAdmin,
     getWishlist,
     saveAddress,
     userCart,
     getUserCart,
     deleteCart,
     applyCoupon,
     createOrder,
     getOrders,
     updateOrderStatus,
     getAllOrders
     } = require('../controller/userCtrl');
const {autheMiddleware,isAdmin} = require ("../middlewares/authMiddleware");


router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.put('/password',autheMiddleware,updatePassword);
router.put('/order/update-order/:id',autheMiddleware,isAdmin,updateOrderStatus);
router.post('/adminlogin',loginAdmin);
router.post('/cart',autheMiddleware,userCart);
router.post('/cart/applycoupon',autheMiddleware,applyCoupon);
router.post('/cart/cash-order',autheMiddleware,createOrder);
router.get('/getwishlist',autheMiddleware,getWishlist );
router.get('/get-all-order',autheMiddleware,isAdmin,getAllOrders);
router.get('/getorder',autheMiddleware,getOrders);
router.get('/get-all-user',getalluser);
router.get('/refresh',handleRefreshToken);
router.get('/logout',logout);

router.get('/getcart',autheMiddleware,getUserCart );
router.delete('/delete-cart',autheMiddleware,deleteCart);
router.get('/:id',autheMiddleware,isAdmin,getUser);

router.delete('/:id',deleteuser);
router.delete('/delete-cart',autheMiddleware,deleteCart);
router.put('/edit-user',autheMiddleware,updateuser);
router.put('/save-adress',autheMiddleware,saveAddress)
router.put('/block-user/:id',autheMiddleware,isAdmin,blockuser);
router.put('/unblock-user/:id',autheMiddleware,isAdmin,unblockuser);

module.exports = router ;
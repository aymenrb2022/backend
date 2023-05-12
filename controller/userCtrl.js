const User = require('../models/userModel');
const Product = require ("../models/productModels");
const {generateToken} =require('../config/jwtToken');
const validateMongoDBId = require('../utils/validateMongodbId')
const { generateRefreshToken } = require('../config/refreshtoken');
const jwt = require('jsonwebtoken');
const Cart = require ('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require ('../models/orderModel');

const uniqid = require('uniqid'); 




const createUser = ( async (req , res) => {
    const email = req.body.email ;
    const findUser = await User.findOne({email:email});
    if (!findUser) {
        // create a new user 
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        res.json({
            status : "FAILED",
            message : "l'utilisateur existe déjà"
        })  
    }
    });
    const loginUserCtrl = async (req, res) => {
        const { email, password } = req.body;
      
        try {
          const findUser = await User.findOne({ email });
          if (findUser && (await findUser.isPasswordMatched(password))) {
            const refreshToken = await generateRefreshToken(findUser._id);
            const updatedUser = await User.findByIdAndUpdate(
              findUser.id,
              { refreshToken },
              { new: true }
            );
      
            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              maxAge: 72 * 60 * 60 * 1000,
            });
      
            res.json({
              _id: findUser._id,
              name: findUser.prenom + ' ' + findUser.nom,
              email: findUser.email,
              token: generateToken(findUser._id),
            });
          } else {
            res.json({
              status: "FAILED",
              message: "Invalid credentials",
            });
          }
        } catch (error) {
          res.status(500).json({
            status: "FAILED",
            message: "An error occurred",
          });
        }
      };
      

    const loginAdmin = async (req, res) => {
        const { email, password } = req.body;
        // check if user exists or not
        const findUser = await User.findOne({ email });
        if (findUser && (await findUser.isPasswordMatched(password))) {
          const refreshToken = await generateRefreshToken(findUser?._id);
          const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
              refreshToken: refreshToken,
            },
            { new: true }
          );
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
          });
          res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
          });
        } else {
          throw new Error("Invalid Credentials");
        }
      };
      
    
      


    const handleRefreshToken = (async(req,res)=>{
    const cookie = req.cookies ;
    console.log(cookie);
    if (!cookie?.refreshToken) throw new Error('No refresh Token is Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error ('No Refresh token present in db or not matched')
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error('there is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken})
    });
    })
    const getalluser =( async (req , res) => {
        try{
           const getallUser = await User.find();
           res.json(getallUser);
        }catch (error){
           throw new Error(error);
        }
    })
    const getUser = (  async (req , res) => {   
        const {id} = req.params ;
        validateMongoDBId(id);
        try{
           const getUser = await User.findById(id);
           res.json ({
            getUser,
        });
        }catch (error){
           throw new Error(error);
        }
    });
    const deleteuser = (async (req , res) => {
        const {id} = req.params;
        validateMongoDBId(id);
        try{
           const deleteUser = await User.findByIdAndDelete(id);
           res.json ({
            deleteUser,
        });
        }catch (error){
           throw new Error(error);
        }
    })
//Lagout functionality 
const logout = (async (req,res)=> {
    const cookie = req.cookies ;
    if (!cookie?.refreshToken) throw new Error('No refresh Token is Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user){
        res.clearCookie('refreshToken',{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204);//forbidden
    }
    await User.findOneAndUpdate(refreshToken,{
        refreshToken:"",
    })
    res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true,
    });
    return res.sendStatus(204);//forbidden
})

//update User
    const updateuser = (async (req,res) => {
        const {_id} = req.user;
        validateMongoDBId(id);
        try{
            const updateUser = await User.findByIdAndUpdate(
                _id,
                {
                    prenom:req?.body?.prenom,
                    nom:req?.body?.nom,
                    email:req?.body?.email,
                    mobile:req?.body?.mobile,
                },
                {
                    new:true,
                }
            )
            res.json(updateUser);
        }catch (error){
         throw new Error(error);
        }
    })


    const saveAddress = (async(req, res,next)=> {
        const {_id} = req.user;
        
        try{
            const updateUser = await User.findByIdAndUpdate(
                _id,
                {
                    address:req?.body?.address,
                },
                {
                    new:true,
                }
            )
            res.json(updateUser);
        }catch (error){
         throw new Error(error);
        }
    })
    

     //Block a User
    const blockuser = (async(req,res) => {
        const { id } = req.params;
        validateMongoDBId(id);
        try{
            const block = await User.findByIdAndUpdate(
                id,{
                    isBlocked:true,
                },
                {
                    new:true,
                }
            );
            res.json(block);
        }catch (error){
            throw new Error(error);
        }
    })

    //unBlock a User
    const unblockuser = (async(req,res)=>{
        const{id} = req.params;
        validateMongoDBId(id);
        try{
            const unblock = await User.findByIdAndUpdate(
                id,
                {
                    isBlocked:false,
                },
                {
                    new:true,
                }
            );
            res.json(unblock);
        }catch (error){
            throw new Error(error);
        }
    })
    

   
const updatePassword = (async (req, res) => {
    const {_id} = req.user;
    const {newpassword} = req.body;
    validateMongoDBId(_id);
    const user = await User.findById(_id);
    if (newpassword) {
        user.password = newpassword ;
        const updatepassword = await user.save();
        res.json(updatepassword);
    } else {
        res.json(user);
    }
})    


const getWishlist = (async (req,res)=> {
    const { _id } = req.user;
    try {
      const findUser = await User.findById(_id).populate("wishlist");
      res.json(findUser)
    } catch (error) {
      throw new Error(error);
    }
  });

    
const userCart = async (req, res, next) => {
    const { productId,color,quantity,price } = req.body;
    const { _id } = req.user;
    validateMongoDBId(_id);
    try {
      
      let newCart = await new Cart({
        userId:_id,
        productId,
        color,
        price,quantity,
      })
      .save();
      res.json(newCart);
    } catch (error) {
      next(error);
    }
  };
  
  

  
  const getUserCart = (async (req,res)=> {
    const {_id} = req.user;
    validateMongoDBId(_id);
    try {
        const cart = await Cart.findOne({userId:_id}).populate(
            "productId"
        );
        res.json(cart)
    }catch (error) {
        next(error);
      }
  });

  const deleteCart = (async (req,res)=> {
    const {_id} = req.user;
    validateMongoDBId(_id);
    try {
        const user= await User.findOne({_id});
        const cart = await Cart.findOneAndRemove({orderby:user._id})
        res.json(cart)
    }catch (error) {
        next(error);
      }
  });

const applyCoupon = (async (req,res,)=> {
    const {name} = req.body;
    const { _id } = req.user;
    validateMongoDBId(_id);
    const validCoupon = await Coupon.findOne({name:name});
    if (validCoupon === null){
        throw new Error ("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let {cartTotal} = await Cart.findOne({ orderby : user._id}).populate("products.product");
    let totalAfterDiscount = (cartTotal- (cartTotal * validCoupon.discount) / 100).toFixed(2);
    await Cart.findOneAndUpdate(
        {orderby:user._id},
        {totalAfterDiscount},
        {new:true}
        );
        res.json (totalAfterDiscount);
})

const createOrder = (async (req,res)=> {
    const {COD,couponApplied} = req.body;
    const {_id} = req.user ;
    validateMongoDBId(_id);
    try {
        if (!COD) throw new Error ("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne ({orderby: user._id});
        let finalAmout =0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmout = userCart.totalAfterDiscount ;
        }else {
            finalAmout = userCart.cartTotal ;
        }
        let newOrder = await new Order ({
            products : userCart.products,
            paymentIntrnet:{
                id:uniqid(),
                method:"COD",
                amount:finalAmout,
                status:"Cash on Delivery",
                created:Date.now(),
                currency:"DT",
            },
            orderby : user._id,
            orderStatus:"Cash on Delivery" ,     
         }).save()
        let update = userCart.products.map((item)=> {
            return {
                updateOne : {
                    filter :{_id:item.product._id},
                    update:{$inc : {quantity: -item.count , sold: +item.count }},
                },
            }
        });
        const updated = await Product.bulkWrite(update,{});
        res.json({message:"succes"});
    }catch (error) {
        throw new Error(error)
    }
});
    
const getOrders = (async (req,res)=> {
    const {_id} = req.user ;
    validateMongoDBId(_id);
    try {
        const userorders = await Order.findOne({orderby:_id})
        .populate({ path: "products.product", options: { strictPopulate: false } })
        .populate({ path: "orderby", options: { strictPopulate: false } })
        .exec();
        res.json(userorders)
    }catch (error) {
        throw new Error(error)
    } 
});
const getAllOrders = (async (req,res)=> {

    try {
        const alluserorders = await Order.find()
        .populate({ path: "products.product", options: { strictPopulate: false } })
        .populate({ path: "orderby", options: { strictPopulate: false } })
        .exec();
        res.json(alluserorders)
    }catch (error) {
        throw new Error(error)
    } 
});
const updateOrderStatus = (async (req,res)=> {
  const {status} = req.body;
  const {id} = req.params;
  
  try {
    const updateorderStatus = await Order.findByIdAndUpdate (
        id,
        {
            orderStatus:status ,
            paymentIntrnet:{
                status: status,
            },
        },
        {new:true}
    );
    res.json(updateorderStatus)
  }catch (error) {
        throw new Error(error)
    } 
});
module.exports = {
    createUser ,
    loginUserCtrl,
    getalluser,
    getUser,
    deleteuser,
    updateuser,
    blockuser,
    unblockuser,
    handleRefreshToken,
    logout,
    updatePassword,
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
    getAllOrders,
} ;
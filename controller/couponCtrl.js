const Coupon = require ("../models/couponModel");
const validateMongoDBId = require('../utils/validateMongodbId');

const createCoupon = (async (req , res)=> {
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error (error);
    }
})

const getallCoupon = (async (req , res)=> {
    try{
        const Coupons = await Coupon.find();
        res.json(Coupons);
    } catch (error) {
        throw new Error (error);
    }
})

const updateCoupon = (async (req, res) => {
    const {id} = req.params ;
    validateMongoDBId(id);
    try {
        const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new:true,
        });
        res.json(updatecoupon);
    }catch (error) {
        throw new Error(error);
    }
});

const deleteCoupon = (async (req, res) => {
    const {id} = req.params ;
    validateMongoDBId(id);
    try {
        const deletecoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletecoupon);
    }catch (error) {
        throw new Error(error);
    }
});


module.exports ={createCoupon,getallCoupon,updateCoupon,deleteCoupon};
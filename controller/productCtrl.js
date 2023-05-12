const Product = require ("../models/productModels");
const slugify = require ('slugify')
const User = require('../models/userModel');


const createProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getProduct = (async(req,res)=>{
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json({ Prod :findProduct});
    } catch (error) {
        throw new Error(error);
    }
});

const getallProduct =( async (req , res) => {
   
    try{
        //filtrage

        const queryObj = { ...req.query };
        const exclurechamps =["page","sort","limit","champs"];
        exclurechamps.forEach((el)=> delete queryObj[el]);
        console.log(queryObj);
        let quaryStr = JSON.stringify(queryObj);
        quaryStr = quaryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`);

        let query = Product.find(JSON.parse(quaryStr));

        //trier

        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort("-createAt")
        }
        //limiter les champs

        if (req.query.champs ){
            const champs = req.query.champs.split(",").join(" ");
            query = query.select(champs);
        } else {
            query=query.select('-__V')
        }
        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) 
           
            res.json 
                ("this page does not exists")
            ;
        }
        console.log(page,limit,skip);


       const product = await query ;
       res.json(product);
    } catch (error) {
       throw new Error(error);
    }
});

const updateProduct = (async (req,res) => {
    const {id} = req.params;
    try{
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProducts = await Product.findOneAndUpdate( id , req.body, {
            new: true,
        });
        res.json(updateProducts);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteProduct = (async (req,res) => {
    const {id} = req.params;
    
    try{
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const deleteProducts = await Product.findOneAndDelete( id , req.body, {
            new: true,
        });
        res.json(deleteProducts);
    } catch (error) {
        throw new Error(error);
    }
});

const Addwishlist = (async (req, res) => {
   const {_id} = req.user ;
   const {prodId} = req.body ;
   try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id)=> id.toString() === prodId) ;
    if (alreadyadded) {
        let user = await User.findByIdAndUpdate(
            _id,
            {
                $pull : {wishlist : prodId},
            },
            {
                new : true ,
            }
        );
        res.json(user);
   } else {
    let user = await User.findByIdAndUpdate(
        _id,
        {
            $push : {wishlist : prodId},
        },
        {
            new : true ,
        }
    );
    res.json(user)
   
   }

   } catch (error) {
   throw new Error(error)
   }
});

const rating = async (req, res) => {
    const { _id } = req.user;
    const { star, comment, prodId } = req.body; // added comment variable
    try {
      const product = await Product.findById(prodId);
      let alreadyrated = product.ratings.find(
        (userId) => userId.postedby.toString() === _id.toString()
      );
      if (alreadyrated) {
        const updateRating = await Product.updateOne(
          {
            "ratings.postedby": _id,
            "ratings._id": alreadyrated._id,
          },
          {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment},
          },
          {
            new: true,
          }
        );
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
          .map((item) => item.star)
          .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
          prodId,
          {
            totalrating: actualRating,
          },
          {
            new: true,
          }
        );
        res.json(finalproduct);
      } else {
        const rateProduct = await Product.findByIdAndUpdate(
          prodId,
          {
            $push: {
              ratings: {
                star: star,
                comment:comment,
                postedby: _id,
              },
            },
          },
          {
            new: true,
          }
        );
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
          .map((item) => item.star)
          .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
          prodId,
          {
            totalrating: actualRating,
          },
          {
            new: true,
          }
        );
        res.json(finalproduct);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
 



module.exports = {createProduct,
    getProduct,
    getallProduct,
    updateProduct,
    deleteProduct,
    Addwishlist,
    rating,
   };
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")


const autheMiddleware = async (req, res, next) => {
    try {
      let token;
      if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded?.id);
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(403).json({
              status: "FAILED",
              message: "Not authorized",
            });
          }
        } else {
          res.status(401).json({
            status: "FAILED",
            message: "No token attached to header",
          });
        }
      } else {
        res.status(401).json({
          status: "FAILED",
          message: "Invalid authorization header",
        });
      }
    } catch (error) {
      res.status(401).json({
        status: "FAILED",
        message: "Not authorized, token expired or invalid",
      });
    }
  };
  
const isAdmin = (async (req,res,next)=>{
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if (adminUser.Role != "admin") {
        res.json({
            status : "FAILED",
            message : "You are not an admin"
        })
    }else {
        next();
    }
})

module.exports = {autheMiddleware,isAdmin };

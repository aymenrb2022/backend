const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// const getUserIdFromToken = (token) => {
//   jwt.verify(localStorage.getItem('token'))
//   return jwt.decode(token).id
// }
module.exports = { generateToken };

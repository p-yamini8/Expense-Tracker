
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if(!token||token==='null')
    {window.Location.href="../login/login.html"
      res.status(401).json({message:"No token provided"})
    }
    console.log('Received token',token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token',decoded);
    console.log("userId from token",decoded.id)
    const user = await User.findByPk(decoded.id);
    if (!user) {
    
      return res.status(404).json({message:'user not found'})
    }
    req.user = user;
    next();
  } catch (err) {

    return res.status(401).json({ message: 'Authentication failed' });
  }
};
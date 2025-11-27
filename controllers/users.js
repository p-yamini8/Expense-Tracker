
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  try {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Missing fields' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      ispremiumuser: user.ispremiumuser
    }, process.env.JWT_SECRET);

    res.json({ message: 'Login successful', token:token, name: user.name,ispremiumuser:user.ispremiumuser});
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
}; 

const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user');

function signToken(user) {
  const payload = { user_id: user._id, email: user.email, role: user.role };
  return jwt.sign(payload, config.SECRET_KEY, { algorithm: config.ALGORITHM, expiresIn: `${config.ACCESS_TOKEN_EXPIRE_MINUTES}m` });
}

async function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.SECRET_KEY, { algorithms: [config.ALGORITHM] });
    const user = await User.findById(payload.user_id).select('-hashed_password');
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { signToken, verifyToken, requireRole };

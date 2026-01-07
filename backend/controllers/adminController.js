const User = require('../models/user');

async function listUsers(req, res) {
  const users = await User.find().select('-hashed_password').sort({ created_at: -1 });
  res.json(users);
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = { listUsers, deleteUser };

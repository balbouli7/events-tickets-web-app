const User = require('../models/user');

// Get all users 
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders 
// exports.getAllOrders = async (req, res) => {
//     try {
//       const orders = await Order.find().populate('user', 'name email'); // Include user details
//       res.status(200).json(orders);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
// };


//delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne(); // or User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
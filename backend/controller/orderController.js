const Order = require('../model/order');
const Cart = require('../model/cart');
const User = require('../model/user');
const Product = require('../model/products');

// Create a new order
const createOrder = async (req, res) => {
  const { addressId, paymentMethod } = req.body;
  const userId = req.userId;

  try {
    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock availability and reduce stock in the product model
    const updatedItems = [];
    for (let item of cart.items) {
      const product = await Product.findById(item.product);
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.title}` });
      }

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();

      updatedItems.push({
        product: item.product,
        quantity: item.quantity,
        size: item.size
      });
    }

    // Create order
    const order = new Order({
      user: userId,
      address: addressId,
      items: updatedItems,
      paymentMethod,
      totalAmount: cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0),
      status: 'Pending'
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('user address items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders for a user
const getAllOrders = async (req, res) => {
  const userId = req.userId; // Assuming userId is available from authentication middleware

  try {
    const orders = await Order.find({ user: userId }).populate('items.product address');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // e.g., Pending, Shipped, Delivered

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrderById, getAllOrders, updateOrderStatus };

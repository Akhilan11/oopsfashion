const Cart = require('../model/cart');
const Product = require('../model/products');

// Cart model - Check product stock when adding to cart
const addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;
  const userId = req.userId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if requested quantity is available
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.title}` });
    }

    // Check if user already has the product in cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId && item.size === size);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Remove a product from the cart
const removeFromCart = async (req, res) => {
  const { productId, size } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the product from the cart
    cart.items = cart.items.filter(item => item.product.toString() !== productId || item.size !== size);
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the user's cart
const getCart = async (req, res) => {
  const userId = req.userId; // Assuming userId is available from authentication middleware

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quantity or size of an item in the cart
const updateCart = async (req, res) => {
  const { productId, quantity, size } = req.body;
  const userId = req.userId;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.product.toString() === productId && item.size === size);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const product = await Product.findById(productId);

    // Check if the updated quantity is available in stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for ${product.title}` });
    }

    // Update quantity
    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { addToCart, removeFromCart, getCart, updateCart };

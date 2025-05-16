const Review = require('../model/review');
const Product = require('../model/products');

// Add a new review for a product
const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.userId;

  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create a new review
    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      comment
    });

    await newReview.save();

    // Update product's average rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
    product.rating = avgRating;
    await product.save();

    res.status(201).json({ message: 'Review added successfully', newReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a product
const getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId }).populate('user');
    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found for this product' });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing review
const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(id, { rating, comment }, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update product's average rating
    const reviews = await Review.find({ product: updatedReview.product });
    const avgRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
    const product = await Product.findById(updatedReview.product);
    product.rating = avgRating;
    await product.save();

    res.status(200).json({ message: 'Review updated successfully', updatedReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update product's average rating
    const product = await Product.findById(deletedReview.product);
    const reviews = await Review.find({ product: product._id });
    const avgRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
    product.rating = avgRating;
    await product.save();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getReviewsByProduct, updateReview, deleteReview };

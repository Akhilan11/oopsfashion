const express = require('express');
const router = express.Router();
const { addReview, getReviewsByProduct, updateReview, deleteReview } = require('../controller/reviewController');

router.post('/add', addReview);
router.get('/product/:productId', getReviewsByProduct);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;

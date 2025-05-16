const express = require('express');
const router = express.Router();
const { addToCart, removeFromCart, getCart, updateCart } = require('../controller/cartController');

router.post('/add', addToCart);
router.delete('/remove/:itemId', removeFromCart);
router.get('/user/:userId', getCart);
router.put('/update/:itemId', updateCart);

module.exports = router;

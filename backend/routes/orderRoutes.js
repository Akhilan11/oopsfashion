const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getAllOrders, updateOrderStatus } = require('../controller/orderController');

router.post('/create', createOrder);
router.get('/:id', getOrderById);
router.get('/user/:userId', getAllOrders);
router.put('/:id', updateOrderStatus);

module.exports = router;

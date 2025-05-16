const express = require('express');
const router = express.Router();
const { addAddress, getAddress, getAllAddresses, updateAddress, deleteAddress } = require('../controller/addressController');

router.post('/add', addAddress);
router.get('/:id', getAddress);
router.get('/user/:userId', getAllAddresses);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

module.exports = router;

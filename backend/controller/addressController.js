const Address = require('../model/address');

// Add new address
const addAddress = async (req, res) => {
  const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;
  const userId = req.userId; // Assuming userId is available from authentication middleware

  try {
    const newAddress = new Address({
      user: userId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address added successfully', newAddress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific address by ID
const getAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all addresses for a user
const getAllAddresses = async (req, res) => {
  const userId = req.userId;

  try {
    const addresses = await Address.find({ user: userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing address
const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

  try {
    const updatedAddress = await Address.findByIdAndUpdate(id, {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country
    }, { new: true });

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address updated successfully', updatedAddress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAddress = await Address.findByIdAndDelete(id);
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addAddress, getAddress, getAllAddresses, updateAddress, deleteAddress };

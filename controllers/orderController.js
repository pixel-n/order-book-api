/**
 * ============================================================================
 * ORDER CONTROLLER
 * Handles encrypted order creation and date/time filtering with live decryption.
 * ============================================================================
 */
const Order = require('../models/Order');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * HIGHLIGHTED API: CREATE ORDER (POST /api/users/order-book)
 * Encrypts sensitive shipping metadata before saving to MongoDB Atlas.
 */
exports.createOrder = async (req, res) => {
  try {
    const { totalAmount, status, shippingDetails } = req.body;

    if (!totalAmount || !shippingDetails) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation error: totalAmount and shippingDetails are required.' 
      });
    }

    const encryptedShipping = encrypt(shippingDetails);

    const newOrder = new Order({
      userId: req.user.id || 'system-user',
      totalAmount,
      status: status || 'Pending',
      shippingDetails: encryptedShipping
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order created, encrypted, and stored successfully in MongoDB Atlas.',
      data: {
        ...savedOrder.toObject(),
        shippingDetails // Returns decrypted view in response for confirmation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * HIGHLIGHTED API: FETCH ORDER BOOK (GET /api/users/order-book)
 * Supports filtering by status and precise date/time ranges, returning decrypted records.
 */
exports.getOrderBook = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    let queryFilter = {};

    if (status) {
      queryFilter.status = status;
    }

    if (startDate || endDate) {
      queryFilter.createdAt = {};
      if (startDate) queryFilter.createdAt.$gte = new Date(startDate);
      if (endDate) queryFilter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(queryFilter).sort({ createdAt: -1 });

    const decryptedOrders = orders.map(order => {
      const orderObj = order.toObject();
      return {
        ...orderObj,
        shippingDetails: decrypt(orderObj.shippingDetails)
      };
    });

    res.status(200).json({
      success: true,
      count: decryptedOrders.length,
      data: decryptedOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
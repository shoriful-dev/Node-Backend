const express = require('express');
const _ = express.Router();
const orderController =require('../../controller/order.controller')
_.route('/create-order').post(orderController.createOrder)

module.exports = _
const express = require('express');
const _ = express.Router();
const orderController =require('../../controller/order.controller')
_.route('/create-order').post(orderController.createOrder)
_.route('/getAllorder').get(orderController.getAllOrders)
_.route('/orderStatus').get(orderController.getAllOrdersStatus)
_.route('/orderupdate/:id').put(orderController.updateOrderById);
_.route('/courierpending').get(orderController.courierPending);

module.exports = _
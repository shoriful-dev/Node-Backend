const express = require('express')
const _ = express.Router()
const deliveryChargeController = require('../../controller/deliverycharge.controller')

_.route('/create-delivarycharge').post(deliveryChargeController.CreateDeliveryCharge)
_.route('/getall-delivarycharge').get(deliveryChargeController.GetAllCharges)
_.route('/single-delivarycharge/:slug').get(deliveryChargeController.GetSingleDeliveryCharge)
_.route('/update-delivarycharge/:slug').put(deliveryChargeController.UpdateDeliveryCharge)
_.route('/delete-delivarycharge/:slug').delete(deliveryChargeController.DeleteDeliVeryCharge)

module.exports = _
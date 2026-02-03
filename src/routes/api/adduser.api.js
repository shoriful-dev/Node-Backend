const express = require('express');
const _ = express.Router();
const  adduserController  = require('../../controller/adduser.controller');
_.route('/add').post(adduserController.addUser);
_.route('/userlist').get(adduserController.getAllUsers);
_.route('/delete/:id').delete(adduserController.deleteUserById);

    

module.exports = _;
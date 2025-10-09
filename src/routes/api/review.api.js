const express = require("express");
const _ = express.Router();
const reviewController = require("../../controller/review.controller");

_.route("/create-review").post(reviewController.createReview);
_.route("/all-review").get(reviewController.getAllReview);
_.route("/update-review/:id").put(reviewController.updateReview);

module.exports = _;

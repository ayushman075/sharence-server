const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const {
  updateUserDetails,
  getUserDetails,
  getAllUserDetails,
} = require("../controllers/data.controller.js");

const detailsRouter = express.Router();




detailsRouter.route("/update").put(ClerkExpressRequireAuth(), updateUserDetails);


detailsRouter.route("/get").get(ClerkExpressRequireAuth(), getUserDetails);

detailsRouter
  .route("/all")
  .get(ClerkExpressRequireAuth(), getAllUserDetails);

module.exports = detailsRouter;

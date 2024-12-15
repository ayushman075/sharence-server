const express = require("express");
const { clerkWebhookListener, getUserProfile, updateUserProfile } = require("../controllers/auth.controller");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const authRouter = express.Router();

authRouter.route("/webhook/clerk").post(clerkWebhookListener);

authRouter.route("/get").get(ClerkExpressRequireAuth(), getUserProfile);

authRouter.route("/update").post(ClerkExpressRequireAuth(), updateUserProfile);

module.exports = authRouter;

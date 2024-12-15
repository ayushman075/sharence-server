const express = require("express");
const { getUserPreferences, updateUserPreferences, deleteUserPreferences } = require("../controllers/preference.controller.js"); 
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

const preferencesRouter = express.Router();


preferencesRouter.route("/get").get(ClerkExpressRequireAuth(), getUserPreferences);


preferencesRouter.route("/update").put(ClerkExpressRequireAuth(), updateUserPreferences);


preferencesRouter.route("/delete").delete(ClerkExpressRequireAuth(), deleteUserPreferences);

module.exports = preferencesRouter;

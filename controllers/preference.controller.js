
const Preferences = require('../models/preference.model.js');  
const ApiResponse = require('../utils/ApiResponse.js'); 
const User = require("../models/auth.model.js");
const AsyncHandler = require('../utils/AsyncHandler.js');
const UserDetails = require('../models/data.model.js');


const getUserPreferences = AsyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  if (!userId) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized Request", false));
  }

  let user = await User.findOne({userId});

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User not found", false));
  }

  let preferences = await Preferences.findOne({ user: user._id });
  if (!preferences) {
    preferences = await Preferences.create({
      shareEmail: false,
      shareContactNumber: false,
      shareAddress: false,
      user: user._id,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, preferences, "Preferences retrieved successfully", true));
});

const updateUserPreferences = AsyncHandler(async (req, res) => {
    const { shareEmail, shareContactNumber, shareAddress } = req.body;
    const userId = req.auth.userId;
  
    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Unauthorized Request", false));
    }
  
  
    const user = await User.findOne({ userId });
  
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "User not found", false));
    }
  
    let preferences = await Preferences.findOne({ user: user._id });
    if (!preferences) {
      preferences = await Preferences.create({
        shareEmail: false,
        shareContactNumber: false,
        shareAddress: false,
        user: user._id,
      });
    }
  
    const removedFields = [];
    if (preferences.shareEmail && shareEmail === false) {
      removedFields.push("email");
      removedFields.push("emailUpdatedAt");
      removedFields.push("emailUpdatedFromIP");
      removedFields.push("emailUpdatedFromDevice");
    }
    if (preferences.shareContactNumber && shareContactNumber === false) {
      removedFields.push("contactNumber");
      removedFields.push("contactNumberUpdatedAt");
      removedFields.push("contactNumberUpdatedFromIP");
      removedFields.push("contactNumberUpdatedFromDevice");
    }
    if (preferences.shareAddress && shareAddress === false) {
      removedFields.push("address");
      removedFields.push("addressUpdatedAt");
      removedFields.push("addressFromIP");
      removedFields.push("addressFromDevice");
    }
  
    preferences.shareEmail = shareEmail !== undefined ? shareEmail : preferences.shareEmail;
    preferences.shareContactNumber = shareContactNumber !== undefined ? shareContactNumber : preferences.shareContactNumber;
    preferences.shareAddress = shareAddress !== undefined ? shareAddress : preferences.shareAddress;
  
    const updatedPreferences = await preferences.save();
  
    if (removedFields.length > 0) {
      const details = await UserDetails.findOne({ user: user._id });
      if (details) {
        removedFields.forEach((field) => {
          details[field] = undefined; 
        });
        await details.save();
      }
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, updatedPreferences, "Preferences updated successfully", true));
  });
  


const deleteUserPreferences = AsyncHandler(async (req, res) => {
  const userId = req.auth.userId;
  if (!userId) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized Request", false));
  }

  let user = await User.findOne({userId});

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User not found", false));
  }

  let preferences = await Preferences.findOne({ user: user._id });
  if (!preferences) {
    return res.status(404).json(new ApiResponse(404, {}, "Preferences not found", false));
  }

  await preferences.remove();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Preferences deleted successfully", true));
});


module.exports = {
  getUserPreferences,
  updateUserPreferences,
  deleteUserPreferences,
};

const User = require("../models/auth.model.js");
const UserDetails = require("../models/data.model.js");
const Preferences = require("../models/preference.model.js");
const ApiResponse = require('../utils/ApiResponse.js'); 
const AsyncHandler = require("../utils/AsyncHandler.js");


const updateUserDetails = AsyncHandler(async (req, res) => {
  const {email, contactNumber, address } = req.body;
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


  if (!user.fullName) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "Name is required", false));
  }

  const preferences = await Preferences.findOne({ user: user._id });

  if (!preferences) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Preferences not found", false));
  }

  let details = await UserDetails.findOne({ user: user._id });


  const userIP = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const userDetails = {};
  
  if (preferences.shareEmail && email && email!=details.email) {
    userDetails.email = email;
    userDetails.emailUpdatedAt = new Date();
    userDetails.emailUpdatedFromIP = userIP;
    userDetails.emailUpdatedFromDevice = userAgent;
  }

  if (preferences.shareContactNumber && contactNumber && contactNumber!=details.contactNumber) {
    userDetails.contactNumber = contactNumber;
    userDetails.contactNumberUpdatedAt = new Date();
    userDetails.contactNumberUpdatedFromIP = userIP;
    userDetails.contactNumberUpdatedFromDevice = userAgent;
  }

  if (preferences.shareAddress && address && address!=details.address) {
    userDetails.address = address;
    userDetails.addressUpdatedAt = new Date();
    userDetails.addressUpdatedFromIP = userIP;
    userDetails.addressUpdatedFromDevice = userAgent;
  }



  if (details) {
    details = await UserDetails.findOneAndUpdate(
      { user: user._id },
      { $set: userDetails },
      { new: true }
    );
  } else {
    details = await UserDetails.create({ user: user._id, ...userDetails });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, details, "User details updated successfully", true));
});


const getUserDetails = AsyncHandler(async (req, res) => {
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

  const details = await UserDetails.findOne({ user: user._id });

  if (!details) {
   details = await UserDetails.create({user:user._id});
  }

  return res
    .status(200)
    .json(new ApiResponse(200, details, "User details fetched successfully", true));
});

const getAllUserDetails = AsyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 10, 
      sort = "createdAt", 
      order = "desc", 
      email, 
      phone, 
      address, 
      name 
    } = req.query;
  
    const filter = {};

    const userId = req.auth.userId;

  if (!userId) {
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized Request", false));
  }
  let user = await User.findOne({userId});

  if (!user || !user.role=='admin') {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User not found or not authorized", false));
  }


  
    if (email) {
      filter.email = { $regex: email, $options: "i" }; 
    }
  
    if (phone) {
      filter.phone = { $regex: phone, $options: "i" }; 
    }
  
    if (address) {
      filter.address = { $regex: address, $options: "i" }; 
    }
  
    
    const sortOrder = order === "asc" ? 1 : -1;
  

    const skip = (page - 1) * limit;
  
  
    const query = UserDetails.find(filter)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "user", 
        match: name ? { fullName: { $regex: name, $options: "i" } } : {},
        select: "fullName", 
      });
  

    const userDetails = await query;
  

    const filteredDetails = userDetails.filter((detail) => detail.user !== null);
  
    const totalCount = await UserDetails.countDocuments(filter);
  
    const pagination = {
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit),
    };
  
    return res
      .status(200)
      .json(new ApiResponse(200, { userDetails: filteredDetails, pagination }, "User details fetched successfully", true));
  });
  

module.exports = {
  updateUserDetails,
  getUserDetails,
  getAllUserDetails
};

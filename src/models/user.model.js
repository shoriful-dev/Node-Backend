const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { customError } = require('../../utils/customError');
const { Types, Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password Missing"],
    },
    phoneNumber: {
      type: Number,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    emailVerified: Boolean,
    phoneNumberVerified: Boolean,
    role: {
      type: Types.ObjectId,
      role: "Role",
    },
    permission: {
      type: Types.ObjectId,
      role: "Permission",
    },
    address: {
      type: String,
      trim: true,
    },
    city: String,
    district: String,
    country: {
      type: String,
      trim: true,
      default: "Bangladesh",
    },
    zipCode: {
      type: Number,
      trim: true,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      trim: true,
      enum: ["male", "female", "custom"],
    },
    cart: {
      type: Types.ObjectId,
      trim: true,
      ref: "Product",
    },
    wishList: {
      type: Types.ObjectId,
      trim: true,
      ref: "Product",
    },
    newsLetterSubscribe: Boolean,
    resetPasswordOtp: Number,
    resetPasswordExpires: Date,
    twoFactorEnabled: {
      type: Boolean,
      trim: true,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      trim: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      trim: true,
      default: false,
    },
    lastlogin: Date,
    lastlogout: Date,
    oAuth: Boolean,
    refreshToken: String,
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    permissions: [
      {
        permission: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Permission",
        },
        actions: [{ type: String }],
      },
    ],
    
  },
  {
    timestamps: true,
  },
);

// hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// compare hash password
userSchema.methods.comparePassword = async function (plainpass) {
  return await bcrypt.compare(plainpass, this.password);
  
};

// generate access Token
userSchema.methods.generateAccessToken = async function () {
  const accessToken =  jwt.sign(
    {
      userId: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    process.env.ACCESSTOKEN_SECRET,
    { expiresIn: process.env.ACCESSTOKEN_EXPIRES }
  );
  return accessToken;
};

// generate refresh Token
userSchema.methods.generateRefreshToken = async function () {
  return  jwt.sign(
    {
      userId: this._id,
    },
    process.env.REFRESHTOKEN_SECRET,
    { expiresIn: process.env.REFRESHTOKEN_EXPIRES }
  );
};

// verify access token
userSchema.methods.verifyAccessToken = async function (token) {
  const isValidAccessToken =  jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
  if(!isValidAccessToken){
    throw new customError(401, "Your Token is Invalid")
  }
}

// verify Refresh token
userSchema.methods.verifyRefreshToken = async function (token) {
  const isValidRefreshToken = await jwt.verify(
    token,
    process.env.REFRESHTOKEN_SECRET
  );
  if (!isValidRefreshToken) {
    throw new customError(401, 'Your Refresh Token is Invalid');
  }
}

module.exports = mongoose.model('User', userSchema);

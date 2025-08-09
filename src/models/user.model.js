const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Types, Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Email Missing'],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password Missing'],
  },
  phoneNumber: {
    type: Number,
    trim: true,
    required: [true, 'PhoneNumber Missing'],
  },
  image: {
    type: String,
    trim: true,
  },
  emailVerified: Boolean,
  phoneNumberVerified: Boolean,
  role: {
    type: Types.ObjectId,
    role: 'Role',
  },
  permission: {
    type: Types.ObjectId,
    role: 'Permission',
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
    default: 'Bangladesh',
  },
  zipCode: {
    type: Number,
    trim: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    trim: true,
    enum: ['male', 'female', 'custom'],
  },
  cart: {
    type: Types.ObjectId,
    trim: true,
    ref: 'Product',
  },
  wishList: {
    type: Types.ObjectId,
    trim: true,
    ref: 'Product',
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
});

// hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
  }
  next();
});

// compare hash password
userSchema.methods.comparePassword = async function (humanPass) {
  return await bcrypt.compare(humanPass, this.password);
};

module.exports = mongoose.model('User', userSchema);

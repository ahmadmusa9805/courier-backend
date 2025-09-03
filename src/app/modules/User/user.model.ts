/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, UserModel } from './user.interface';


const userSchema = new Schema<TUser, UserModel>(
  {
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String },
  otpVerified: { type: Boolean, default: false },
  passwordChangedAt: { type: Date },
  profileImg: { type: String },
  role: { type: String, enum: ['superAdmin', 'admin', 'courier', 'user', 'company'], required: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  emailStatus: { type: String, enum: ['verified', 'unverified'], default: 'verified' },
  jobPosted: { type: Boolean },
  userType: { type: String, enum: ['individual', 'company'], default: 'individual' },
  companyName: { type: String },
  companyLocation: { type: String },
  approvalStatus: { type: Boolean , default: true},
  communicationMode: { type: String, enum: ['whatsapp', 'textMessage'] },
  howKnow: { type: String, enum: ['google', 'socialMedia', 'website'] },
  courierExperience: { type: String },
  profileVerified: { type: String, enum: ['verified', 'unverified'], default: 'verified' },
  document: { type: String },
  legalForm: { type: String },
  isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
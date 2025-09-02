/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, UserModel } from './user.interface';


const userSchema = new Schema<TUser, UserModel>({
  name: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  phoneNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailStatus: {
    type: String,
    enum: ['verified', 'notVerified'],
    default: 'notVerified',
  },
  password: {
    type: String,
    required: true,
    select: false, // Hide password in queries
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  profileImg: {
    type: String,
    default: '',
  },
  address: String,
  legalForm: String,
  document: String,
  profileVerified: {
    type: String,
    enum: ['verified', 'notVerified'],
  },
  courierExperience: String,
  companyLocation: String,
  companyName: String,
  communicationMode: {
    type: String,
    enum: ['whatsApp', 'textMessage'],
  },
  approvalStatus: String,
  jobPosted: String,
  howKnow: {
    type: String,
    enum: ['google', 'website', 'socialMedia'],
  },
  role: {
    type: String,
    enum: ['client', 'superAdmin', 'admin', 'business'],
    default: 'client',
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // adds createdAt & updatedAt automatically
});

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
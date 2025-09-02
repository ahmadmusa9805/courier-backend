/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';


export type EmailStatus = 'verified' | 'notVerified';
export type ProfileStatus = 'verified' | 'notVerified';
export type CommunicationMode = 'whatsApp' | 'textMessage';
export type HowKnow = 'google' | 'website' | 'socialMedia';
export type UserStatus = 'active' | 'blocked';
export type UserRole = 'client' | 'superAdmin' | 'admin' | 'business';


export interface TUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  emailStatus: EmailStatus;
  phoneNo: string;
  password: string;
  otpVerified: boolean;
  passwordChangedAt?: Date;
  profileImg?: string;
  address?: string;
  postCode?: string;
  legalForm?: string;
  document?: string;
  profileVerified?: ProfileStatus;
  courierExperience?: string;
  companyLocation?: string;
  companyName?: string;
  communicationMode?: CommunicationMode;
  approvalStatus?: string;
  jobPosted?: string;
  howKnow?: HowKnow;
  role: UserRole;
  status?: UserStatus;
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  // Static methods for checking if the user exists
    // isUserExistsByCustomEmail(email: string): Promise<TUser>;
  isUserExistsByCustomEmail(email: string): Promise<TUser | null>;

  // Static method for password comparison
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  // Static method to check JWT issuance timing
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
export type TUserRole = keyof typeof USER_ROLE;

import config from '../config/index.js';
import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';

const superUser = {
  name: 'Super Admin',
  email:  config.super_admin_email || 'simone@themvv.co.uk',
  password: config.super_admin_password || 'superAdmin12345',
  otpVerified: true,
  needsPasswordChange: false,
  contactNo: "+4407823878152",
  role: USER_ROLE.superAdmin,
  status: 'active',
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;

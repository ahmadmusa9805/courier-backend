export const USER_ROLE = {
  superAdmin: 'superAdmin',
  user: 'user',
  admin: 'admin',
  company: 'company',
  courier: 'courier',
} as const;


export const usersSearchableFields = [
  'email',
  // 'address',
  'postCode',
  'contactNo',
  'name'
];


export const UserStatus = ['active', 'blocked'];

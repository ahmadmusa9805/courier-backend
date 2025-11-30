export const USER_ROLE = {
  superAdmin: 'superAdmin',
  user: 'user',
  admin: 'admin',
  company: 'company',
  courier: 'courier',
} as const;


export const usersSearchableFields = [
  'email',
  'name.firstName',
  'name.lastName',
  'phone',
  'contactNo',
  'name'
];


export const UserStatus = ['active', 'blocked'];

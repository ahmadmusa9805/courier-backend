export const USER_ROLE = {
  superAdmin: 'superAdmin',
  client: 'client',
  basicAdmin: 'basicAdmin',
  primeAdmin: 'primeAdmin',
} as const;


export const usersSearchableFields = [
  'email',
  'address',
  'postCode',
  'contactNo',
  'name'
];


export const UserStatus = ['active', 'blocked'];

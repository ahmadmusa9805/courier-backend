import { Rating } from "../Rating/Rating.model";
import { User } from "../User/user.model";


const getAllAnalyticsCombinedFromDB = async () => {
  // Count total ratings
  const totalRating = await Rating.countDocuments();

  // Count total users, including superAdmins
  const totalUser = await User.countDocuments({role: { $ne: 'superAdmin' } });

  // Count active users excluding superAdmins
  const activeUser = await User.countDocuments({
    status: 'active',
    role: { $ne: 'superAdmin' }  // Exclude superAdmin
  });



  // Count blocked users, excluding superAdmins
  const blockedUser = await User.countDocuments({
    status: 'blocked',
    role: { $ne: 'superAdmin' }  // Exclude superAdmin
  });

  return {
    totalRating,
    totalUser,
    activeUser: activeUser, // This includes both regular active users and superAdmins
    blockedUser,
  };
};


export const AnalyticServices = {
  getAllAnalyticsCombinedFromDB,
};

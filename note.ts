// user                     single/business
// courier                  (courier, admin))
// admin                    (admin)
// auth                     (for courier, user, admin)
// otp  
//                         (for courier, user, admin)
// item                    (for courier, user, admin)
// time slot                (for courier, user, admin)
// blog                     (home page for user)
// testimonial
// customer support         (for courier, user, admin)
// Term and condition
// Privacy policy
// reviews                  
// FAQ
// analitics

// jobs                     (for courier, user, admin) (need to discuss for courier part)
// daily route              (for courier)  (need to discuss for courier part)
// notification             (for courier, user, admin)
// chat                     (for courier, user, admin)
// payment
// payout



// ==================================================================================

// user have block feature
// item should active or inactive
// blog should active or inactive

// need to discuss
// payout
// what is the difference between shipment and new job
// type of transportation
// items

// Home page
// navigation
// banner
// how it works
// our partners
// testimonials
// Why choose us
// faq
// Together we make an impact
// footer
// ===================================================
// user
// name first and last name
// email
// email Status (verified, unverified)
// job posted
// createdDate
// password
// userType (individual, business)
// status (active, bloged)

// courier
// phone
// company name
// company location
// Approval Status
// CommunicationMode (whatsapp,text message)
// How You Know About Us (google, social media, website)
// Courier Experienc   (need to add)
// Profile Verified    (verified, unverified)
// document
// Legal Form           (need to add)

// image


// =================================================

// jobs
// from
// to
// transportationType{
//     fromprivatehome:{

// }
//     fromstore
//     fromanauction
//     smallmove
// }
// Where do we pick it up? (fromprivatehome, fromstore, from an auction, small move)
// Where does the object come from?
// item
     // Product Name *
     // dimensions (L x W x H) in cm *
     // Does it contain any of these materials? (glass, wood, metal , food, plants, animals, others)  

//items
// name
// length
// width
// height
// price
// createDate
// status (active, inactive)
// description
// file












// reviews
// user
// courier
// job
// ratings
// comment
// status

// time slot  ( 10:00 - 14:00)
// price
// type (pickup, delivery)
// startTime
// endTime


// Payout
// courier
// email
// job
// earnings
// commision
// final
// paid on
// paid from - to

// blog
// title
// description
// image
// status (active, inactive)

// testimonial
// name
// sub title
// status (active, inactive)
// ratings (1-5)
// comment
// createdDate

//FAQ
// question
// answer

// Term
// title

// Privacy
// title


// dashboard
// total users
// active users
// blocked users
// total reviews
//////////////////////////////
// for updating data it canbe work

// Flatten function remains unchanged
// const flattenObject = (obj: any, parentKey: string = ''): any => {
//   let result: any = {};

//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       const newKey = parentKey ? `${parentKey}.${key}` : key;
//       if (typeof obj[key] === 'object' && obj[key] !== null) {
//         Object.assign(result, flattenObject(obj[key], newKey)); // Recurse into nested object
//       } else {
//         result[newKey] = obj[key]; // Base case: primitive value, add to result
//       }
//     }
//   }
//   return result;
// };


// const updateJobIntoDB = async (id: string, payload: any) => {
//   const {transportationType, items, pickupDateInfo, deliveryDateInfo, extraService, pickupAddress, deliveryAddress, ...other} = payload
//   const flattenedPayload = flattenObject(payload);  // Flatten the entire payload
//   const existingJob = await mongoose.connection
//     .collection('jobs')
//     .findOne(
//       { _id: new mongoose.Types.ObjectId(id) },
//     );
//   if (!existingJob) {
//     throw new Error('Job not found');
//   }
//   if (existingJob.isDeleted) {
//     throw new Error('Cannot update a deleted Job');
//   }
//   // Build the update query using $set to update only the desired fields
//   const updateQuery: any = { $set: {} };
//   // Add each field from flattened payload to the $set query
//   for (const key in flattenedPayload) {
//     if (flattenedPayload[key] !== undefined) {
//       updateQuery.$set[key] = flattenedPayload[key];
//     }
//   }
//   const updatedJob = await Job.findByIdAndUpdate(
//     { _id: id },
//     updateQuery,
//     { new: true, runValidators: true },
//   );
//   if (!updatedJob) {
//     throw new Error('Job not found after update');
//   }
//   return updatedJob;
// };
////////////////////////////

///////////////////////////
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import httpStatus from 'http-status';
// import QueryBuilder from '../../builder/QueryBuilder';
// import AppError from '../../errors/AppError';
// import { JOB_SEARCHABLE_FIELDS } from './Job.constant';
// import mongoose from 'mongoose';
// import { Job } from './Job.model';
// import { User } from '../User/user.model';
// import { flattenObject } from './job.utils';

// const createJobIntoDB = async (payload:any) => {
//   // try {
//     const { contact } = payload;

//    const userdata = {
//     name: contact.name,
//     email: contact.email,
//     phone: contact.phone,
//     password: contact.password || '12345',
//     role: contact.userType,
//     userType: contact.userType,
//    }

//     const existingUser = await User.isUserExistsByCustomEmail(contact.email);

//     if (!existingUser) {

//     // Create User
//     const createdUser = await User.create(userdata);
//     // console.log("createdUser.....", createdUser);

//     if (!createdUser) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
//     }

//     // Add createdUser's _id to the payload for Job creation
//     payload.userId = createdUser._id;
//   }

//    if(existingUser) {
//     payload.userId = (existingUser as any)._id;
//    }

//     // Create Job
//     const createdJob = await Job.create(payload);
//     // console.log("createdJob.....", createdJob);

//     if (!createdJob) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Job');
//     }

//     // Populate userId field to get the full user data
//     const jobWithUser = await Job.findById(createdJob._id).populate('userId');

//     // Return the job along with the populated user data
//     return jobWithUser;

//   // } catch (error) {
//     // console.error("Error during job creation:", error);
//     // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
//   }
// const getAllJobsFromDB = async (query: Record<string, unknown>) => {
//   const JobQuery = new QueryBuilder(
//     Job.find(),
//     query,
//   )
//     .search(JOB_SEARCHABLE_FIELDS)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await JobQuery.modelQuery;
//   const meta = await JobQuery.countTotal();
//   return {
//     result,
//     meta,
//   };
// };

// const getAllJobsForUserFromDB = async (query: Record<string, unknown>, user: any) => {
//   const { userEmail } = user;
//   const usr = await User.isUserExistsByCustomEmail(userEmail);

//   if (!usr) {
//     throw new Error('User not found');
//   }

//   let sortOption = {};

//   // Check if a 'sort' parameter exists in the query for 'courierPrice'
//   if (query.sortBy === 'courierPrice') {
//     const order = query.order === 'desc' ? -1 : 1; // Default to ascending (1), descending (-1)
//     sortOption = { courierPrice: order }; // Sort by 'courierPrice' field
//   }

//   // Build the base query for 'user', 'company', 'courier', and 'superAdmin' roles
//   let baseQuery;

//   // // Accept both 'user', 'company', and 'superAdmin' as valid roles for userId
//   if (usr.role === 'user' || usr.role === 'company') {
//       baseQuery = Job.find({ userId: (usr as any)._id });
//     // const JobQuery = new QueryBuilder(
//     //   Job.find({userId:(usr as any)._id}),
//     //   query,
//     // )
//     //   .search(JOB_SEARCHABLE_FIELDS)
//     //   .filter()
//     //   .sort(sortOption)
//     //   .paginate()
//     //   .fields();

//     // const result = await JobQuery.modelQuery;
//     // const meta = await JobQuery.countTotal();
//     // return {
//     //   result,
//     //   meta,
//     // };
//   } else if (usr.role === 'courier') {

//       baseQuery = Job.find({ courierId: (usr as any)._id });

//     // const JobQuery = new QueryBuilder(
//     //   Job.find({ courierId: (usr as any)._id }),
//     //   query,
//     // )
//     //   .search(JOB_SEARCHABLE_FIELDS)
//     //   .filter()
//     //   .sort()
//     //   .paginate()
//     //   .fields();

//     // const result = await JobQuery.modelQuery;
//     // const meta = await JobQuery.countTotal();
//     // return {
//     //   result,
//     //   meta,
//     // };
//   } else {
//     // For any other role, return all jobs
//         baseQuery = Job.find();
//     // const JobQuery = new QueryBuilder(
//     //   Job.find(),
//     //   query,
//     // )
//     //   .search(JOB_SEARCHABLE_FIELDS)
//     //   .filter()
//     //   .sort()
//     //   .paginate()
//     //   .fields();

//     // const result = await JobQuery.modelQuery;
//     // const meta = await JobQuery.countTotal();
//     // return {
//     //   result,
//     //   meta,
//     // };
//   }

//   // Create the query builder instance
//   const JobQuery = new QueryBuilder(baseQuery, query)
//     .search(JOB_SEARCHABLE_FIELDS)  // Search functionality
//     .filter()                       // Apply filters
//     .sort()                         // Apply sorting (this will use dynamic sort if provided in the query)
//     .paginate()                     // Apply pagination
//     .fields();                      // Apply field selection

//   // If 'sortBy' is provided in the query, adjust sorting dynamically
//   if (Object.keys(sortOption).length > 0) {
//     JobQuery.modelQuery = JobQuery.modelQuery.sort(sortOption);
//   }

//   // Execute the query and return results
//   const result = await JobQuery.modelQuery;
//   const meta = await JobQuery.countTotal();

//   return {
//     result,
//     meta,
//   };

// };

// const getDailyRouteJobsFromDB = async (query: Record<string, unknown>, user: any) => {

//   const { userEmail } = user;
//   const usr = await User.isUserExistsByCustomEmail(userEmail);

//   if (!usr) {
//     throw new Error('User not found');
//   }

//   // --- Handle pickupDate query ---
//   let dateFilter = {};
//   if (query.pickupDate) {
//     const date = new Date(query.pickupDate as string);

//     // Full UTC day range
//     const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
//     const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1, 0, 0, 0));

//     dateFilter = {
//       'pickupDateInfo.date': { $gte: startOfDay, $lt: endOfDay },
//     };

//     // Prevent QueryBuilder.filter() from overriding our date filter
//     delete query.pickupDate;
//   }

//   // --- Base query depending on role ---
//   let baseQuery = {};
//   if (usr.role === 'user' || usr.role === 'company') {
//     baseQuery = { userId: (usr as any)._id, ...dateFilter };
//   } else if (usr.role === 'courier') {
//     baseQuery = { courierId: (usr as any)._id, ...dateFilter };
//   } else {
//     baseQuery = { ...dateFilter };
//   }

//   // --- Query Builder chain ---
//   const JobQuery = new QueryBuilder(Job.find(baseQuery), query)
//     .search(JOB_SEARCHABLE_FIELDS)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await JobQuery.modelQuery;
//   const meta = await JobQuery.countTotal();

//   return { result, meta };
// };

// const getSingleJobFromDB = async (id: string) => {
//   const result = await Job.findById(id).populate('userId').populate('courierId');

//   return result;
// };

// const updateJobIntoDB = async (id: string, payload: any, user: any) => {

//   const { userEmail } = user;
//   const usr = await User.isUserExistsByCustomEmail(userEmail);

//   if (!usr) {
//     throw new Error('User not found');
//   }

//   const { items } = payload;
//   // const { items, extraService, ...other } = payload;
//   const flattenedPayload = flattenObject(payload);  // Flatten the entire payload

//   const existingJob = await mongoose.connection
//     .collection('jobs')
//     .findOne({ _id: new mongoose.Types.ObjectId(id) });

//   if (!existingJob) {
//     throw new Error('Job not found');
//   }

//   if (existingJob.isDeleted) {
//     throw new Error('Cannot update a deleted Job');
//   }

//   const updateQuery: any = { $set: {} };

//   // Handle "add" and "remove" for items separately to avoid conflicts
//   if (items) {
//     if (items.add && items.add.length > 0) {
//       // First update: Add new items
//       await Job.updateOne(
//         { _id: id },
//         { $push: { items: { $each: items.add } } }
//       );
//     }

//     if (items.remove && items.remove.length > 0) {
//       // Second update: Remove items by ID
//       await Job.updateOne(
//         { _id: id },
//         { $pull: { items: { _id: { $in: items.remove } } } }
//       );
//     }
//   }

//   // Add other fields from the flattened payload to the update query
//   for (const key in flattenedPayload) {
//     if (flattenedPayload[key] !== undefined) {
//       updateQuery.$set[key] = flattenedPayload[key];
//     }
//   }

//    // Accept both 'user', 'company', and 'superAdmin' as valid roles for userId
//   if (usr.role === 'courier' || payload.status === 'accepted') {
//     updateQuery.courierId = (usr as any)._id;
//   }

//   // Perform the update for other fields
//   const updatedJob = await Job.findByIdAndUpdate(
//     { _id: id },
//     updateQuery,
//     { new: true, runValidators: true }
//   );

//   if (!updatedJob) {
//     throw new Error('Job not found after update');
//   }

//   return updatedJob;
// };

// const deleteJobFromDB = async (id: string) => {
//   const deletedService = await Job.findByIdAndDelete(
//     id,
//     // { isDeleted: true },
//     { new: true },
//   );

//   if (!deletedService) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Job');
//   }

//   return deletedService;
// };

// export const JobServices = {
//   createJobIntoDB,
//   getAllJobsFromDB,
//   getSingleJobFromDB,
//   updateJobIntoDB,
//   deleteJobFromDB,
//   getAllJobsForUserFromDB,
//   getDailyRouteJobsFromDB
// };

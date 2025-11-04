/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { RATING_SEARCHABLE_FIELDS } from './Rating.constant';
import mongoose from 'mongoose';
import { TRating } from './Rating.interface';
import { Rating } from './Rating.model';
import { User } from '../User/user.model';
import { Job } from '../Job/Job.model';

const createRatingIntoDB = async (
  payload: TRating,
  user: any
) => {

const job = await Job.findOne({ _id: payload.jobId });

if (!job?.courierId) {
  throw new AppError(httpStatus.BAD_REQUEST, 'Courier ID not found for this job');
}

  payload.courierId = job?.courierId;

  // Fetch the user based on email
  const usr = await User.findOne({ email: user.userEmail });

   // Set the userId to the currently logged-in user's ID
   payload.userId = usr?._id;


  const { professionalism, communication, friendliness } = payload;
  const totalRatings = professionalism + communication + friendliness;
  let averageRatings = totalRatings / 3;


   averageRatings = parseFloat(averageRatings.toFixed(2)); 

  // Set the average ratings value
  payload.averageRatings = averageRatings;

  const result = await Rating.create(payload);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Rating');
  }

  const ratings = await Rating.find({ courierId: payload.courierId });
  
  if(ratings.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, ' Rating not available for this courier');
  }

  const totalAverageRating = ratings.reduce((sum, rating) => sum + rating.averageRatings, 0);
  const totalRatingsCount = ratings.length;
  const overallAverageRating = totalAverageRating / totalRatingsCount;

  const courierData = await User.findOne({ _id: job?.courierId });

  if (!courierData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Courier not found');
  }

  // Update the courier's average ratings
  courierData.averageRatings = parseFloat(overallAverageRating.toFixed(2));

  // Perform the update operation for the user (not the rating)
  const updatedCourier = await User.findByIdAndUpdate(
    job?.courierId,
    { averageRatings: courierData.averageRatings },
    { new: true, runValidators: true }
  );


  return result;
};

const getAllRatingsFromDB = async (query: Record<string, unknown>) => {
  const RatingQuery = new QueryBuilder(
    Rating.find(),
    query,
  )
    .search(RATING_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await RatingQuery.modelQuery;
  const meta = await RatingQuery.countTotal();
  return {
    result,
    meta,
  };
};

const getAllAverageElementsRatingsFromDB = async (query: Record<string, unknown>, user: any) => {

  // Fetch the user based on email
  const usr = await User.findOne({ email: user.userEmail });

  // Build the Rating query with necessary filters
  const RatingQuery = new QueryBuilder(
    Rating.find({ courierId: usr?._id }),  // Use courierId from the fetched user
    query,
  )
    .search(RATING_SEARCHABLE_FIELDS)  // Apply search filters if necessary
    .filter()  // Apply additional filters if any
    .sort()  // Sorting (optional, you can adjust sorting based on needs)
    .paginate()  // Pagination (optional)
    .fields();  // Field selection, you can modify this to select specific fields

  // Execute the query and get the result
  const result = await RatingQuery.modelQuery
    .select('professionalism communication friendliness averageRatings courierId')  // Select the required fields
    .exec();  // We don't need to use populate here for courierId, because we will fetch it separately

  // Calculate the averages for each field
  const totalCount = result.length;

  // Calculate averages for professionalism, communication, friendliness, and averageRatings
  const averageProfessionalism = result.reduce((acc, rating) => acc + rating.professionalism, 0) / totalCount;
  const averageCommunication = result.reduce((acc, rating) => acc + rating.communication, 0) / totalCount;
  const averageFriendliness = result.reduce((acc, rating) => acc + rating.friendliness, 0) / totalCount;
  const averageRatings = result.reduce((acc, rating) => acc + rating.averageRatings, 0) / totalCount;

  // Get total count of ratings
  const totalRatingsCount = totalCount;

  // Fetch full user (courier) data using the courierId from the first rating in the result
  const courier = await User.findById(result[0]?.courierId, 'name.firstName name.lastName email phone profileImg');

  // Prepare the aggregated result with the courier data
  const aggregatedResult = {
    professionalism: parseFloat(averageProfessionalism.toFixed(2)),
    communication: parseFloat(averageCommunication.toFixed(2)),
    friendliness: parseFloat(averageFriendliness.toFixed(2)),
    averageRatings: parseFloat(averageRatings.toFixed(2)),
    courier: courier,  // Now it has the populated user (courier) data
    totalRatingsCount,    // Total ratings count
  };


  // Return the aggregated result
  return {
    success: true,
    message: "Aggregated ratings are retrieved successfully",
    data: aggregatedResult,
  };
};



const getSingleRatingFromDB = async (id: string) => {
  const result = await Rating.findById(id);

  return result;
};

const updateRatingIntoDB = async (id: string, payload: any) => {
  // Fetch the existing rating from the database
  const isDeletedService = await mongoose.connection
    .collection('ratings')
    .findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!isDeletedService) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rating not found');
  }

  if (isDeletedService.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'Cannot update a deleted Rating');
  }

  // Recalculate averageRatings if any of the rating fields are being updated
  if (payload.professionalism || payload.communication || payload.friendliness) {
    const professionalism = payload.professionalism || isDeletedService.professionalism;
    const communication = payload.communication || isDeletedService.communication;
    const friendliness = payload.friendliness || isDeletedService.friendliness;

    const totalRatings = professionalism + communication + friendliness;



    payload.averageRatings = totalRatings / 3; // Recalculate average
   payload.averageRatings = parseFloat(payload.averageRatings.toFixed(2)); 
  }

  // Perform the update operation
  const updatedData = await Rating.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  if (!updatedData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Rating not found after update');
  }

  return updatedData;
};
const deleteRatingFromDB = async (id: string) => {
  const deletedService = await Rating.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Rating');
  }

  return deletedService;
};

export const RatingServices = {
  createRatingIntoDB,
  getAllRatingsFromDB,
  getSingleRatingFromDB,
  updateRatingIntoDB,
  deleteRatingFromDB,
  getAllAverageElementsRatingsFromDB
};

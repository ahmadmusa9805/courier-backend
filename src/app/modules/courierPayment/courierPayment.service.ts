/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { COURIERPAYMENT_SEARCHABLE_FIELDS } from './courierPayment.constant';
import mongoose from 'mongoose';
import { TCourierPayment } from './courierPayment.interface';
import { CourierPayment } from './courierPayment.model';
import { Job } from '../Job/Job.model';
import { getFridayRange, singleCourierAllJobsPayments, singleCourierPaymentWeekly } from './courierPayment.utils';
import { User } from '../User/user.model';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
const TZ = "Europe/Amsterdam";


const createCourierPaymentIntoDB = async (
  payload: TCourierPayment,
) => {
  const result = await CourierPayment.create(payload);
  
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create CourierPayment');
  }

  return result;
};



const getSingleCourierPaymentweeklyFromDB = async (id: string) => {


const { start, end } = getFridayRange();

const jobs = await Job.find({
  courierId: id,
  status: "completed",
  "deliveryDateInfo.date": {
    $gte: start,
    $lte: end,
  },
})
.select("courierPrice jobId courierId deliveryDateInfo ")
.populate("courierId", "name email phone")
.lean();




const updatedJobs = jobs.map((job) => {
  const priceIncl = job.courierPrice;

  const btw = Number((priceIncl * 21 / 121).toFixed(2)); // ✅ correct VAT part
  const btwExcld = Number((priceIncl - btw).toFixed(2));

  return {
    ...job,
    btw,
    btwExcld,
  };
});

  // ✅ Step 2: calculate totals
  const totalIncl = updatedJobs.reduce((sum, job) => sum + job.courierPrice, 0);

  const totalBtw = Number((totalIncl * 21 / 121).toFixed(2));
  const totalExcl = Number((totalIncl - totalBtw).toFixed(2));


// ✅ Invoice Period (formatted)
  const invoicePeriod = `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;



    // ✅ Step 3: return everything
  return {
    jobs: updatedJobs,
    invoicePeriod,
    jobCount: updatedJobs.length,
    summary: {
      btw: totalBtw,
      totalExcl,
      totalIncl,
    },
  };
};

const getSingleCourierPaymentsAllJobsFromDB = async (id: string) => {


  const courierdata = await User.findById(id).select('createdAt').lean();

if(!courierdata) {
  throw new AppError(httpStatus.NOT_FOUND, 'Courier not found');
}


  // ✅ start = courier createdAt, end = now (Amsterdam)
  const start = dayjs(courierdata?.createdAt).tz(TZ).startOf("day").toDate();
  const end = dayjs().tz(TZ).endOf("day").toDate();


const jobs = await Job.find({
  courierId: id,
  status: "completed",
  "deliveryDateInfo.date": {
    $gte: start,
    $lte: end,
  },
})
.select("courierPrice jobId courierId deliveryDateInfo")
.populate("courierId", "name email phone")
.lean();




const updatedJobs = jobs.map((job) => {
  const priceIncl = job.courierPrice;

  const btw = Number((priceIncl * 21 / 121).toFixed(2)); // ✅ correct VAT part
  const btwExcld = Number((priceIncl - btw).toFixed(2));

  return {
    ...job,
    btw,
    btwExcld,
  };
});

  // ✅ Step 2: calculate totals
  const totalIncl = updatedJobs.reduce((sum, job) => sum + job.courierPrice, 0);

  const totalBtw = Number((totalIncl * 21 / 121).toFixed(2));
  const totalExcl = Number((totalIncl - totalBtw).toFixed(2));


// ✅ Invoice Period (formatted)
  const invoicePeriod = `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;



    // ✅ Step 3: return everything
  return {
    jobs: updatedJobs,
    invoicePeriod,
    jobCount: updatedJobs.length,
    summary: {
      btw: totalBtw,
      totalExcl,
      totalIncl,
    },
  };
};

const getAllCourierPaymentsWeeklyFromDB = async (query: Record<string, unknown>) => {
  // ✅ Step 1: paginate couriers
  const courierQuery = new QueryBuilder(
    User.find({ role: "courier" }).select(
      "name companyName kvkNumber btwNumber email companyLocation address"
    ).lean(),
    query
  )
    .search(COURIERPAYMENT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();


  const couriers = await courierQuery.modelQuery.lean();
  const meta = await courierQuery.countTotal();



  // ✅ Step 2: get invoice per courier
  const paymentsData = await Promise.all(
    couriers.map(async (courier) => {
      const data = await singleCourierPaymentWeekly(
        courier._id.toString()
      );

      return {
        courier,
        ...data,
      };
    })
  );


  // ✅ Step 3: return
  return {
    result: paymentsData,
    meta,
  };
}

const getAllCourierPaymentsAllJobsFromDB = async (query: Record<string, unknown>) => {
  // ✅ Step 1: paginate couriers
  const courierQuery = new QueryBuilder(
    User.find({ role: "courier" }).select(
      "name companyName kvkNumber btwNumber email createdAt"
    ).lean(),
    query
  )
    .search(COURIERPAYMENT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();


  const couriers = await courierQuery.modelQuery.lean();
  const meta = await courierQuery.countTotal();



  // ✅ Step 2: get invoice per courier
  const paymentsData = await Promise.all(
    couriers.map(async (courier) => {
      const data = await singleCourierAllJobsPayments(
        courier._id.toString(),
        courier.createdAt
      );

      return {
        courier,
        ...data,
      };
    })
  );


  // ✅ Step 3: return
  return {
    result: paymentsData,
    meta,
  };


}




const getSingleCourierPaymentFromDB = async (id: string) => {


const { start, end } = getFridayRange();

const jobs = await Job.find({
  courierId: id,
  status: "completed",
  "deliveryDateInfo.date": {
    $gte: start,
    $lte: end,
  },
})
.select("courierPrice jobId courierId deliveryDateInfo")
.populate("courierId", "name email phone")
.lean();




const updatedJobs = jobs.map((job) => {
  const priceIncl = job.courierPrice;

  const btw = Number((priceIncl * 21 / 121).toFixed(2)); // ✅ correct VAT part
  const btwExcld = Number((priceIncl - btw).toFixed(2));

  return {
    ...job,
    btw,
    btwExcld,
  };
});

  // ✅ Step 2: calculate totals
  const totalIncl = updatedJobs.reduce((sum, job) => sum + job.courierPrice, 0);

  const totalBtw = Number((totalIncl * 21 / 121).toFixed(2));
  const totalExcl = Number((totalIncl - totalBtw).toFixed(2));


// ✅ Invoice Period (formatted)
  const invoicePeriod = `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;



    // ✅ Step 3: return everything
  return {
    jobs: updatedJobs,
    invoicePeriod,
    jobCount: updatedJobs.length,
    summary: {
      btw: totalBtw,
      totalExcl,
      totalIncl,
    },
  };
};

const getAllCourierPaymentsFromDB = async (query: Record<string, unknown>) => {
  // ✅ Step 1: paginate couriers
  const courierQuery = new QueryBuilder(
    User.find({ role: "courier" }).select(
      "name companyName kvkNumber btwNumber email createdAt"
    ).lean(),
    query
  )
    .search(COURIERPAYMENT_SEARCHABLE_FIELDS)
    .filter()
    .sort()
    .paginate()
    .fields();


  const couriers = await courierQuery.modelQuery.lean();
  const meta = await courierQuery.countTotal();



  // ✅ Step 2: get invoice per courier
  const paymentsData = await Promise.all(
    couriers.map(async (courier) => {
      const data = await getSingleCourierPaymentAllFromDB(
        courier._id.toString(),
        courier.createdAt
      );

      return {
        courier,
        ...data,
      };
    })
  );


  // ✅ Step 3: return
  return {
    result: paymentsData,
    meta,
  };


}


const updateCourierPaymentIntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('courierpayments')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('CourierPayment not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted courierPayment');
  }

  const updatedData = await CourierPayment.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('CourierPayment not found after update');
  }

  return updatedData;
};

const deleteCourierPaymentFromDB = async (id: string) => {
  const deletedService = await CourierPayment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete CourierPayment');
  }

  return deletedService;
};

export const CourierPaymentServices = {
  createCourierPaymentIntoDB,
  getAllCourierPaymentsFromDB,
  getSingleCourierPaymentFromDB,
  updateCourierPaymentIntoDB,
  deleteCourierPaymentFromDB,
  getAllCourierPaymentsWeeklyFromDB,
  getAllCourierPaymentsAllJobsFromDB,
  getSingleCourierPaymentweeklyFromDB,
  getSingleCourierPaymentsAllJobsFromDB
};

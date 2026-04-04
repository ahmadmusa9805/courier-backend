/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Job } from "../Job/Job.model";

dayjs.extend(utc);
dayjs.extend(timezone);
const TZ = "Europe/Amsterdam";

function getFridayRange() {
  const now = dayjs().tz(TZ);

  // Get this week's Friday
  let thisFriday = now.day(5); // 5 = Friday

  if (now.day() < 5) {
    thisFriday = thisFriday.subtract(7, "day");
  }

  const lastFriday = thisFriday.subtract(7, "day");

  return {
    start: lastFriday.startOf("day").toDate(),
    end: thisFriday.endOf("day").toDate(),
  };
}


const singleCourierPaymentWeekly = async (id: string) => {


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


const singleCourierAllJobsPayments = async (id: string, courierCreatedAt: any) => {

  // ✅ start = courier createdAt, end = now (Amsterdam)
  const start = dayjs(courierCreatedAt).tz(TZ).startOf("day").toDate();
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
    const btw = Number((priceIncl * 21 / 121).toFixed(2));
    const btwExcld = Number((priceIncl - btw).toFixed(2));
    return {
      ...job,
      btw,
      btwExcld,
    };
  });

  const totalIncl = updatedJobs.reduce((sum, job) => sum + job.courierPrice, 0);
  const totalBtw = Number((totalIncl * 21 / 121).toFixed(2));
  const totalExcl = Number((totalIncl - totalBtw).toFixed(2));

  const invoicePeriod = `${dayjs(start).tz(TZ).format("DD/MM/YYYY")} - ${dayjs(end)
    .tz(TZ)
    .format("DD/MM/YYYY")}`;


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



// // const { start, end } = getFridayRange();
// const courier = await User.findById(id).lean();
//   const courierCreatedAt = courier?.createdAt;
//   if (!courierCreatedAt) {
//     // Handle case where courier or createdAt is missing
//     throw new AppError(404, 'Courier not found or invalid creation date');
//   }

//   const tz = 'America/New_York'; // Replace with dynamic timezone if needed
//   const start = dayjs(courierCreatedAt).tz(tz).startOf('day').toDate();
//   const end = dayjs().tz(tz).endOf('day').toDate();
  
//   // const start = dayjs(courierCreatedAt).tz(tz).startOf("day").toDate();
//   // const end = dayjs().tz(tz).endOf("day").toDate();

// const jobs = await Job.find({
//   courierId: id,
//   status: "completed",
//   "deliveryDateInfo.date": {
//     $gte: start,
//     $lte: end,
//   },
// })
// .select("courierPrice jobId courierId deliveryDateInfo")
// .populate("courierId", "name email phone")
// .lean();




// const updatedJobs = jobs.map((job) => {
//   const priceIncl = job.courierPrice;

//   const btw = Number((priceIncl * 21 / 121).toFixed(2)); // ✅ correct VAT part
//   const btwExcld = Number((priceIncl - btw).toFixed(2));

//   return {
//     ...job,
//     btw,
//     btwExcld,
//   };
// });

//   // ✅ Step 2: calculate totals
//   const totalIncl = updatedJobs.reduce((sum, job) => sum + job.courierPrice, 0);

//   const totalBtw = Number((totalIncl * 21 / 121).toFixed(2));
//   const totalExcl = Number((totalIncl - totalBtw).toFixed(2));


// // ✅ Invoice Period (formatted)
//   const invoicePeriod = `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;



//     // ✅ Step 3: return everything
//   return {
//     jobs: updatedJobs,
//     invoicePeriod,
//     jobCount: updatedJobs.length,
//     summary: {
//       btw: totalBtw,
//       totalExcl,
//       totalIncl,
//     },
//   };
};



export { getFridayRange, singleCourierPaymentWeekly, singleCourierAllJobsPayments };
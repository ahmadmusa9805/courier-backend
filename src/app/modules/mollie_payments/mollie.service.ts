import { CloudWatchLogs } from "aws-sdk";
import AppError from "../../errors/AppError";

import fs from 'fs'
import { PaymentInfo } from "./types/payment.types";
import { JobModel } from "../Job/Job.interface";
import { Job } from "../Job/Job.model";
const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey:process.env.MOLLIE_BASIC_TEST_API_KEY});
console.log(process.env.WEBHOOKURL)

// function is responsible for creating link into mollie platform
export const createPaymentWithMollie = async function( {jobId,currency,url}:{url:string,currency:'EUR',jobId:string , }) {
if(!jobId){
  throw new AppError(400, 'Job id not provided!')
}
  const jobInfo = await Job.findOne({_id:jobId}).populate("userId")

  
try{
    const payment = await mollieClient.payments.create({
  amount: {
    currency: currency,
    value: String(jobInfo?.totalPrice)
  },
  description: `JobNo : #${jobId} Job will be picked from ${jobInfo?.from} and sent to ${jobInfo?.to}`,
  redirectUrl: url,
  webhookUrl: process.env.WEBHOOKURL,
  metadata: {
    jobId
  }
});
// console.log(payment._links)
return payment
}catch(error:any){
  console.log(error)
  throw new AppError(error.statusCode , error.message)
}
}
// console.log()
// createPaymentWithMollie()


export const findTransections = async function( {transection_id}:{transection_id:string})  {

try{  
  const payment = await mollieClient.payments.get(transection_id);
// console.log(payment)
return payment
}catch(error:any){
  console.log(error)
  throw new AppError(error.statusCode , error.message)
}
}
// findTransections({transection_id:"tr_cF4U92mCdPpVMiFBaR4HJ"})
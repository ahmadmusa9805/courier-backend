import { CloudWatchLogs } from "aws-sdk";
import AppError from "../../errors/AppError";

import fs from 'fs'
import { PaymentInfo } from "./types/payment.types";

const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey:process.env.MOLLIE_BASIC_TEST_API_KEY});


// function is responsible for creating link into mollie platform
export const createPaymentWithMollie = async function( {currency,metadata,amount,description,}:{currency:'EUR',metadata:any, amount:string , description:string , }) {

try{  const payment = await mollieClient.payments.create({
  amount: {
    currency: currency,
    value: amount
  },
  description: description,
  redirectUrl: 'http://localhost:5173/',
  webhookUrl: 'https://tops-saver-valuable-took.trycloudflare.com/webhook',
  metadata: metadata
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


export const findTransections = async function( {transection_id}:{transection_id:string}) : Promise<PaymentInfo> {

try{  
  const payment = await mollieClient.payments.get(transection_id);
return payment
}catch(error:any){
  console.log(error)
  throw new AppError(error.statusCode , error.message)
}
}
findTransections({transection_id:"tr_cF4U92mCdPpVMiFBaR4HJ"})
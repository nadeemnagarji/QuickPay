import { Queue } from "bullmq";

const depositqueue= new Queue("deposit-queue",{
    connection:{
        host:"127.0.0.1",
        port:6379
    }
})

type paymentInformationType = {
    token:string,
    amount:number,
    userId:number
}

export async function AddDeposits(paymentInformation:paymentInformationType) {
 const res = await   depositqueue.add("deposits",paymentInformation)
 console.log("deposit added to queue",res.id);
 return res
}
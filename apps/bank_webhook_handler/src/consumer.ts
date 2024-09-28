import { Job, Worker } from "bullmq";
import db from "@repo/db/client"
import IORedis from "ioredis"


const redisClient = new IORedis({
    maxRetriesPerRequest: null, // This is required by BullMQ for worker connections
  });

console.log("Worker  in consumer has been started and is now listening for jobs...");
// Check Redis connection status
redisClient.on("connect", () => {
  console.log("Connected to Redis successfully.");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const worker = new Worker("deposit-queue",async(job:Job)=>{
    console.log("working...",job.id);
     await new Promise(resolve=>setTimeout(resolve,4000))
    const paymentInformation = job.data
    console.log("PAYMENT INFO=====",paymentInformation);
    console.log('Updating Balance for UserId:', paymentInformation.userId);

    
    // Update balance in db, add txn

    try {
        
    const existingBalance = await db.balance.findUnique({
        where: { userId: Number(paymentInformation.userId) }
    });

    console.log('Existing Balance Record:', existingBalance);

        await db.$transaction([
            db.balance.upsert({
                where: { userId: paymentInformation.userId },
                update: {
                    amount: {
                        increment: paymentInformation.amount
                    }
                },
                create: {
                    userId: paymentInformation.userId,
                    amount: paymentInformation.amount,
                    locked: 0
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success"
                }
            })
        ]);
          console.log(`Balance and transaction updated successfully for UserId: ${paymentInformation.userId}`)
       
        
    } catch (error) {
        console.error("Error processing deposit job:", error);
       return Promise.reject(new Error(`Failed to add deposit in db ${job.id}`))
    }
    
},{connection:redisClient});

worker.on("failed",(job,err)=>{
    console.error(`Job ${job?.id} failed with error: ${err.message}`);
})
worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully`);
});

export default worker
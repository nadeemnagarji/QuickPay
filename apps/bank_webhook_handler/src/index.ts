import express, { urlencoded } from "express";
import db from "@repo/db/client"

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
import { AddDeposits } from "./producer";
import worker from "./consumer";

console.log("Worker has been started and is now listening for jobs...");


app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    console.log("BODYYYY====",req.body);
    
    const paymentInformation = {
        token: req.body.token,
        userId: req.body.userId,
        amount: req.body.amount
    };


    try {
        
    const queueResponse = await AddDeposits(paymentInformation)
    console.log("deposit added to queue",queueResponse.id);
    res.status(200).json({
        message:"captured"
    })
    } catch (error) {
        console.error(error);
            res.status(500).json({
                message: "Error while processing webhook"
            })
    }


   
    // console.log("PAYMENT INFO=====",paymentInformation);
    // console.log('Updating Balance for UserId:', paymentInformation.userId);

    // const existingBalance = await db.balance.findUnique({
    //     where: { userId: Number(paymentInformation.userId) }
    // });

    // console.log('Existing Balance Record:', existingBalance);
    
    // // Update balance in db, add txn

    // try {
    //     await db.$transaction([
    //         db.balance.upsert({
    //             where: { userId: paymentInformation.userId },
    //             update: {
    //                 amount: {
    //                     increment: paymentInformation.amount
    //                 }
    //             },
    //             create: {
    //                 userId: paymentInformation.userId,
    //                 amount: paymentInformation.amount,
    //                 locked: 0
    //             }
    //         }),
    //         db.onRampTransaction.updateMany({
    //             where: {
    //                 token: paymentInformation.token
    //             },
    //             data: {
    //                 status: "Success"
    //             }
    //         })
    //     ]);
    // //    console.log("UPDATED RESULT",updatedResult);
       
    //     res.status(200).json({
    //         message:"captured"
    //     })
    // } catch (error) {
    //     console.error(error);
    //     res.status(411).json({
    //         message: "Error while processing webhook"
    //     })
    // }
})

app.get("/test",async(req,res)=>{
    res.json("test is working")
})
app.listen(3003)
"use server"

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { error } from "console";
import axios from "axios";
import { data } from "autoprefixer";

export  async function sendP2P(sendTo:string, amount:number,) {
 const session = await getServerSession(authOptions)
 const id = session.user.id
 console.log("IDDDDDDDDD",id);
 
 if(id){
    try {
        const user = await prisma.balance.findFirst({where:{userId:Number(id)}})
        console.log("SENDER BALANCE====",user?.amount);
        if(user && user?.amount<amount){
           return{
            message:"INSUFFICIENT BALANCE",
            status:400
           }
        }

        const receiver = await prisma.user.findFirst({where:{number:sendTo}})
        console.log("RECEIVER Name====",receiver?.name);
        
        if(!receiver){
            return{
                message:"USER NOT FOUND IN DATABASE",
                status:404
               }
        }
console.log("TRANSACTION STARTED====from",user?.id,"TO",receiver.id);

    await prisma.$transaction(async (tx)=>{
           await tx.balance.update({
                where:{
                    userId:Number(id)
                },
                data:{
                    amount:{
                        decrement:amount
                    }
                }
            }),
          await tx.balance.upsert({
                where:{userId:Number(receiver.id)},
                update:{
                    amount:{
                        increment:amount
                    }
                },
                create: {
                    userId:Number(receiver.id),
                    amount: amount,
                    locked: 0
                }

            })
        }
           
        )
        console.log("TRANSACTION ENDED==== from", user?.id, "TO", receiver.id);
            return {
                message: "P2P Payment successfully done",
                status: 200
            };
    } catch (e) {
        console.error("Error during transaction:", e); 
        return {
            message:"error while creating onRampdata in database",
        }
    }
    
 }

 
}   



/*

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
            })
 
*/

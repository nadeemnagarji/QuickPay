"use server"

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { error } from "console";
import axios from "axios";
import { data } from "autoprefixer";
import toast from "react-hot-toast";

export  async function createOnrampTransaction(provider:string, amount:number) {
 const session = await getServerSession(authOptions)
 const id = session.user.id
 const token = Math.random().toString();
 if(id){
    try {
        const res = await prisma.onRampTransaction.create({
            data:{
                userId:Number(id),
                  status:"Processing",
                  token,
                   provider,
                   amount:amount*100,
                   startTime: new Date(),
            }
        })
        
    const response = await axios.post("http://localhost:3005/deposit",{ token: token,
      userId:Number(id),
      amount: amount})
        console.log("RESPONSE=====>",response);
        
        if(response.status===200){
            toast.success("balance added successfully please reload")   
        }else{
            toast.error("error while adding balance")
        }

        // return {
        //     message:"OnRampTransaction successfully done"
        // }
    } catch (e) {
        return {
            message:"error while creating onRampdata in database",
        }
    }
    
 }

 
}   



/*



*/

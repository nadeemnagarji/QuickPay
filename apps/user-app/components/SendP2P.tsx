"use client"

import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { TextInput } from '@repo/ui/textinput';
import { log } from 'console';
import React, { useState } from 'react'
import { sendP2P } from '../lib/actions/sendPeerToPeer';
function SendP2P() {
    const [amount,setAmount] = useState(0)
    const [number,setNumber] = useState("")
    const [done,setDone]= useState(false)

    const transfer = async()=>{
       console.log("AMOUNT==",amount," Number==",number);
       
        const res = await sendP2P(number,amount*100)
        console.log(res);
        
        if(res?.status===200){
          console.log(res.message);
          window.location.reload()
            setDone(true)
        }
    }


  return (
    <Card title="Send Money">
    <div className="w-full">
        <TextInput label={"Amount"} placeholder={"Amount"}  onChange={(value)=> setAmount(Number(value))} />
        <TextInput label={"Send to"} placeholder={"Number"}  onChange={(value)=> setNumber(value)} />
        <div className="flex justify-center pt-4">
<Button  onClick={ ()=>{transfer()}}>
Send Money
</Button>
{done && <p className=' text-green-500 text-md font-bold'>TRANSFER DONE</p>}
</div>
    </div>
</Card>
  )
}

export default SendP2P

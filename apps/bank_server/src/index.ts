import express, { urlencoded } from "express";
import axios from "axios"
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/deposit",async (req,res)=>{
        const amount = req.body.amount;
        const token = req.body.token;
        const userId = req.body.userId
console.log("DEPOSIT BALANCE====",amount,token,userId);

    try {
        const handler = await axios.post("http://localhost:3003/hdfcWebhook",{ token,
            userId,
            amount:amount*100 //to handle decimal stuff i.e. 5 rs ==> 500 in db
      })
      console.log( handler);
      
      if(handler.data.status==200){
        res.status(200).json({message:
            "Money transferred Successfully"
        })
      }else{
        res.status(500).json({message:handler.data.message})
      }

    } catch (error) {
    console.log("bank server down please try again later");
        return
    }
})

app.get("/test",async(req,res)=>{
    res.json("bank server is working")
})
app.listen(3005)
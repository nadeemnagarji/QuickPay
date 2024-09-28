


import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";


export default async function Home() {

 const session = await getServerSession(authOptions)

 console.log(session);
 
 if(session?.user){
  redirect("/dashboard")
 }else{
  redirect("/api/auth/signin")
 }
}

import { useEffect, useState } from "react";
import {getSession, GetSessionParams, useSession} from "next-auth/react"
import { Session } from "next-auth";

function HomePage({title, session}:{title:string, session:Session}) {
  console.log("ServerSideProps",title)
  console.log("ServerSideProps",session)
  const {data,status}=useSession() //para obetener los datos a través del hook es necesario envolver la app dentro del sessionProvider
  console.log(data,status)
  const [user,setUser]= useState()
  // Más rapido obtener los datos desde el front
  useEffect(()=>{
    (async ()=> {
      const sessionFront= await getSession()
      setUser(sessionFront?.user)
    })()
  },[])
  return ( 
    <>
    
    <div>HomePage</div>
    <h2>{title}</h2>
    <h1>{user?.name}</h1>
    <p>{user?.email}</p>
    <img src={user?.image} alt="" />

    <h2>Con session provider</h2>
    <h1>{data?.user.name}</h1>
    <p>{data?.user.email}</p>
    <img src={data?.user.image} alt="" />
    <span>{status}</span>
    </>
   );
}
// Más seguro obtener datos desde el back
export const getServerSideProps = async (context: GetSessionParams | undefined) => {
  const session = await getSession(context)

  if (!session) return {
    redirect: {
      destination: '/api/auth/signin',
      permanent: false
    }
  }
  return {
    props: {
      title: 'My first page',
      session
    }
  }
}
export default HomePage;
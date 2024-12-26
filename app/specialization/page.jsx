"use client";
import { useMatchStore } from '@/store/match';
import {Button} from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import Link from 'next/link';

const page = () => {
    const { specializations, fetchSkills } = useMatchStore()
    const router = useRouter()

    const onChooseSpecializationsHandler = (specialization) =>{
        fetchSkills({specialization})
        router.push("/skill")
    }

    useEffect(()=> {
        if(!specializations.length){
          return router.push("/buildingprofile")
        }
      }, [specializations])

  return (
    <div className='h-screen flex w-screen relative' >
      <div className="absolute top-5 left-5 flex items-center group">
        <Link href="/initial">
        <img src="../../assets/icons/home2.svg" alt="Home Logo" width="50px" />
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Go back to Initial Page
        </span>
        </Link>
      </div>
    <div className='w-1/2 items-center justify-center h-screen md:flex hidden' >
    <img src="../../assets/images/specialization.svg" alt="Choose specialization" width="380px" className='m-auto'/>
    </div>
    <div className='w-1/2 flex items-center justify-center ' >
      <div className=' md:ml-0 ml-[100%] text-[20px]' >
      <p className='text-[22px] mb-12 font-bold tracking-wide leading-relaxed'><span className='text-[24px] font-extrabold'>Choose ONE</span> <br/>specialization that you're most excited about !</p>
        {specializations.length && specializations.map((specializations,index) => (
          <Button 
            color="primary" 
            size='lg' 
            key={index} 
            className='!text-[18px] !py-[20px] !px-[25px] mr-5 mb-8 hover:bg-green-500 hover:text-black' 
            onClick={() => onChooseSpecializationsHandler(specializations)}
          >
            {specializations}
          </Button> 
        ))}
         
      </div>
    </div>
  </div>
  )
}

export default page

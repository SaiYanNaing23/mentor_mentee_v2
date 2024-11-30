"use client";
import { useMatchStore } from '@/store/match';
import {Button} from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
    const { specializations, fetchSkills } = useMatchStore()
    const router = useRouter()

    const onChooseSpecializationsHandler = (specialization) =>{
        console.log(specialization)
        fetchSkills({specialization})
        router.push("/skill")
    }

    useEffect(()=> {
        if(!specializations.length){
          return router.push("/buildingprofile")
        }
      }, [specializations])

  return (
    <div className='h-screen flex w-screen' >
    <div className='w-1/2 flex items-center justify-center h-screen' >
    <img src="../../assets/images/specialization.svg" alt="Choose specialization" width="380px" className='m-auto'/>
    </div>
    <div className='w-1/2 flex items-center justify-center ' >
      <div>
      <p className='text-[22px] mb-12 font-bold tracking-wide leading-relaxed'><span className='text-[24px] font-extrabold'>Choose ONE</span> <br/>specialization that you're most excited about<br/> from the options below !</p>
        {specializations.length && specializations.map((specializations,index) => (
          <Button 
            color="primary" 
            size='lg' 
            key={index} 
            className='!text-[18px] !py-[20px] !px-[25px] mr-5 mb-8 ' 
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

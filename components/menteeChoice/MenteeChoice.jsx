"use client"
import React, { useEffect } from 'react'
import {Button} from "@nextui-org/react";
import { useMatchStore } from '@/store/match';
import { useRouter } from 'next/navigation';

const MenteeChoice = () => {
  const router = useRouter()
  const { careers, fetchSpecialization } = useMatchStore()
  const onChooseCareerHandler = (career) => {
    try {
      fetchSpecialization({career})
      router.push("/specialization")
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(()=> {
    if(!careers.length){
      return router.push("/buildingprofile")
    }
  }, [careers])

  return (
    <div className='h-screen flex w-screen' >
      <div className='w-1/2  items-center justify-center h-screen md:flex hidden' >
        <img src="../../assets/images/career.svg" alt="choose career options" width="600px" className='m-auto'/>
      </div>
      <div className='w-1/2 flex items-center justify-center ' >
        <div className=' md:ml-0 ml-[100%]' >
          <p className='text-[22px] mb-12 font-bold tracking-wide leading-relaxed'><span className='text-[24px] font-extrabold'>Choose ONE</span> <br/>career path that aligns with your interests and goals<br/> from the options below !</p>
          {careers.length && careers.map((career,index) => (
            <Button 
              color="primary" 
              size='lg' 
              key={index} 
              className='!text-[18px] !py-[20px] !px-[25px] mr-5 mb-8 ' 
              onClick={() => onChooseCareerHandler(career)}
            >
              {career}
            </Button> 
          ))}
           
        </div>
      </div>
    </div>
  )
}

export default MenteeChoice;
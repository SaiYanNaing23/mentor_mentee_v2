"use client"
import React, { useEffect } from 'react'
import {Button} from "@nextui-org/react";
import { useMatchStore } from '@/store/match';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className='h-screen flex w-screen relative' >
      <div className="absolute top-5 left-5 flex items-center group">
        <Link href="/initial">
        <img src="../../assets/icons/home2.svg" alt="Home Logo" width="50px" />
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Go back to Initial Page
        </span>
        </Link>
      </div>
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
              className='!text-[18px] !py-[20px] !px-[25px] mr-5 mb-8 hover:bg-green-500 hover:text-black' 
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
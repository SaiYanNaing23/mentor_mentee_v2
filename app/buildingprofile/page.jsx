"use client"
import GlobalNav from '@/components/dashboardpageUI/Globalnav'
import Dashboard from '@/components/dashboardpageUI/Dashboard'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Buildingprofile from '@/components/buildingprofileUI/BuildingProfile'

const page = () => {
  const { user } = useAuthStore()
  const router = useRouter()

  // useEffect(()=>{
  //   if(!user){
  //     router.push('/initial')
  //     return
  //   }
  // },[user])
  
  if (user) {
    return (
      <div className='h-screen overflow-y-hidden'>
        <GlobalNav />
        <Buildingprofile/>
      </div>
    )
  }
}

export default page

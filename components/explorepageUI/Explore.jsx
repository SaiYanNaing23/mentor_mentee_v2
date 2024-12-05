"use client"
import React, { useEffect, useState } from 'react'
import style from '@/components/explorepageUI/explore.module.css'
import mentorStyle from '@/components/mymatchespageUI/mymatches.module.css'

import SideNavBar from '../navbar/sideNavBar'
import { validateToken } from '@/utils/helper';
import { useExploreStore } from '@/store/explore';
import Link from 'next/link';
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

const Explore = () => {
  const { mentors, exploreMentors } = useExploreStore()
  const [toggle, setToggle ] = useState(1)
  const [ isRedirecting, setIsRedirecting ] = useState(false);
  const router = useRouter()

  const onRedirectingHandler = (id) => {
    setIsRedirecting(true)
    router.push(`/mentor/detail/${id}`)
    setIsRedirecting(false)
  }
  const toggleTab = (index, field) =>{
    setToggle(index)
    exploreMentors({ field })
  }
  useEffect(()=>{
    validateToken()
    exploreMentors({ field : 'Recommendation'})
  },[])
  return (
    <div className={style.maindiv}>
        {/* Side Navbar */}
        <SideNavBar/>

        {/* Explore Page */}
        <div className={style.contentdiv}> 
            <h1 className={style.maintitle}>Explore mentors !</h1>
            <input className={style.searchbar} type="text" placeholder="Search"></input>

            <div className='mt-[50px] mb-[50px]'>
              <div>
                <ul className={style.titlelist}>
                  <li className={toggle == 1 ? style.titleactive : style.title} onClick={() => toggleTab(1, 'Recommendation')} >Recommendation</li>
                  <li className={toggle == 2 ? style.titleactive : style.title} onClick={() => toggleTab(2, 'Information Technology')} >Information Technology</li>
                  <li className={toggle == 3 ? style.titleactive : style.title} onClick={() => toggleTab(3, 'Healthcare')} >Healthcare</li>
                  <li className={toggle == 4 ? style.titleactive : style.title} onClick={() => toggleTab(4, 'Engineering')} >Engineering</li>
                  <li className={toggle == 5 ? style.titleactive : style.title} onClick={() => toggleTab(5, 'Business and Finance')} >Business and Finance</li>
                  <li className={toggle == 6 ? style.titleactive : style.title} onClick={() => toggleTab(6, 'Art and Design')} >Art and Design</li>
                </ul>
              </div>
            </div>
            <div className='grid grid-cols-4 mb-[50px] ' >
              {
                mentors.length && mentors.map((mentor)=> (
                  <div key={mentor._id} className={mentorStyle.mentor}>
                    <img src="../../assets/images/profile.svg" alt="profile picture" className={mentorStyle.image}></img>
                    <h2 className={mentorStyle.name}>{mentor.name}</h2>
                    <p className={mentorStyle.jobtitle}>{mentor.job_title}</p>
                    {/* <Link href={} > */}
                        <Button color="primary" className='text-[16px] !py-8 px-5 ' isLoading={isRedirecting} onClick={() => onRedirectingHandler(mentor._id)}  >View Profile</Button>
                    {/* </Link> */}
                  </div>
                ))
              }
            </div>
        </div>
    </div>
  )
}

export default Explore

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
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth'

const Explore = () => {
  const { mentors, exploreMentors, searchMentors } = useExploreStore()
  const [toggle, setToggle ] = useState(1)
  const [ isRedirecting, setIsRedirecting ] = useState(false);
  const [ searchKey, setSearchKey ] = useState("");
  const router = useRouter()
  const { authCheck, user } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const onRedirectingHandler = (id) => {
    setIsRedirecting(true)
    router.push(`/mentor/detail/${id}`)
    setIsRedirecting(false)
  }
  const toggleTab = (index, field) =>{
    setToggle(index)
    exploreMentors({ field })
  }

  const searchMentorsHandler = () => {
    if(!searchKey) return toast.error("error", { description : "Search Keyword is required!" } )
    let credentials = {
      user_id : user._id,
      jobTitle : searchKey
    }
    searchMentors( credentials )
  }
  useEffect(()=>{
    validateToken()
    exploreMentors({ field : 'Recommendation'})
    authCheck()
  },[])
  return (
    <div className={style.maindiv}>
        {/* Side Nav bar */}
      <div className=' hidden md:block ' >
        <SideNavBar/>
      </div>
      <div className='md:hidden size-6 cursor-pointer !z-[1000] ml-5' >
          { isMobileMenuOpen === false ?  (<svg xmlns="http://www.w3.org/2000/svg" onClick={toggleMobileMenu} width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"/></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" onClick={toggleMobileMenu} width="32" height="32" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z" clip-rule="evenodd"/></svg>)}
      </div>

      {/* Mobile Nav Bar */}
      {isMobileMenuOpen && (
        <ul className='absolute flex flex-col gap-y-12 text-center w-full md:hidden z-50 bg-gray-200 top-0 left-0 h-screen px-5 py-[200px] ' >
            <Link href={'/'} className='cursor-pointer font-bold hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                Dashboard
            </Link>
            <Link  href={'/explore'} className='cursor-pointer font-bold hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                Explore
            </Link>
            <Link href={'/matches'} className='cursor-pointer font-bold hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                My Matches
            </Link>
            <Link href={'/about'} className='cursor-pointer font-bold hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                About
            </Link>
            <Link href={'/profile'} className='cursor-pointer font-bold hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                Profile
            </Link>
        </ul>
        )}

        {/* Explore Page */}
        <div className={style.contentdiv}> 
            <h1 className={style.maintitle}>Explore mentors !</h1>
            <div className='flex gap-5 items-center'>
              <input className={style.searchbar} type="text" placeholder="Search" value={searchKey}onChange={(e) => setSearchKey(e.target.value)}/>
              <Button variant="bordered" className="text-[16px] py-8 px-5 border-[#00246b8f] text-[#FFFFFF] bg-[#00246B] font-bold" onClick={searchMentorsHandler}>
                Search
              </Button>
              {searchKey && (
                <button className="ml-2 w-10 h-10 text-xl text-black-500 border-2 border-black rounded-full flex items-center justify-center hover:bg-black-200" onClick={() => setSearchKey('')} aria-label="Clear search">
                  ✖
                </button>
              )}
            </div>
            
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
            <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-2 mb-[50px] ' >
              {
                mentors.length > 0 ? (
                  mentors.map((mentor)=> (
                    <div key={mentor._id} className={mentorStyle.mentor}>
                      <img src="../../assets/images/profile.svg" alt="profile picture" className={mentorStyle.image}></img>
                      <h2 className={mentorStyle.name}>{mentor.name}</h2>
                      <p className={mentorStyle.jobtitle}>{mentor.job_title}</p>
                      {/* <Link href={} > */}
                      <div className='ml-[20px] md:ml-0 ' >
                          <Button color="primary" className='md:text-[18px] md:py-8 md:px-5 ' isLoading={isRedirecting} onClick={() => onRedirectingHandler(mentor._id)}  >View Profile</Button>
                      </div>
                      {/* </Link> */}
                    </div>
                  ))
                ) : (
                  <div className='py-[64px] text-[18px] font-bold'>
                    <p>
                      There's NO Mentor!
                    </p>
                </div>
                )
              }
            </div>
        </div>
    </div>
  )
}

export default Explore

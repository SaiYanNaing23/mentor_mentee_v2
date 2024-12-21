'use client'
import React, { useEffect, useState } from 'react'
import style from '@/components/mymatchespageUI/mymatchesv1.module.css'
import SideNavBar from '../navbar/sideNavBar'
import { useAuthStore } from '@/store/auth';
import moment from "moment";
import Link from 'next/link';
import { validateToken } from '@/utils/helper';

const Mymatches = () => {
    const { authCheck } = useAuthStore()
    const [ userSchedules, setUserSchedules ] = useState([]);
    const [ myMatches, setMyMatches ] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    useEffect(()=>{
        validateToken()
        authCheck().then(()=> {
            const schedule = useAuthStore.getState().user.mySchedules;
            const myMatches = useAuthStore.getState().user.myMatches;
            setUserSchedules(schedule || []);
            setMyMatches(myMatches || []);
        })
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
        <ul className='absolute flex flex-col gap-y-8 text-center w-full md:hidden z-50 bg-gray-200 top-0 left-0 h-screen px-5 py-[200px] ' >
            <Link href={'/'} className='cursor-pointer hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                Dashboard
            </Link>
            <Link  href={'/explore'} className='cursor-pointer hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                Explore
            </Link>
            <Link href={'/matches'} className='cursor-pointer hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                My Matches
            </Link>
            <Link href={'/about'} className='cursor-pointer hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                About
            </Link>
            <Link href={'/profile'} className='cursor-pointer hover:font-extrabold text-[28px]  ' onClick={toggleMobileMenu} >
                Profile
            </Link>
        </ul>
        )}

        {/* My Matches Page */}
        <div className={style.contentdiv}>

            {/* My Matches */}
            <div className='mb-[96px]' >
                <h1 className={style.title}>My Matches</h1>
                <div className={style.matches}>
                    {/* Mentor 1 */}
                    { myMatches.length > 0 ? (
                        myMatches.map((mentor) => (
                            <div key={mentor._id} className={style.mentor}>
                                <img src="../../assets/images/profile.svg" alt="profile picture" className={style.image}></img>
                                <h2 className={style.name}>{mentor.name}</h2>
                                <p className={style.jobtitle}>{mentor.job_title}</p>
                                <Link href={`/mentor/detail/${mentor._id}`} >
                                    <button className={style.button}>View Profile</button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className='py-[64px] text-[18px] '>
                            <p>
                                You have not chosen a mentor. Explore mentors who aligns with your profession !
                            </p>
                        </div>
                    )}
                    
                </div>

            </div>

        </div>

    </div>
  )
}

export default Mymatches

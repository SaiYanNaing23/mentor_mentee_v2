'use client'
import React, { useEffect, useState } from 'react'
import style from '@/components/aboutpageUI/about.module.css'
import Footer from '@/components/initialpageUI/Footer'
import SideNavBar from '../navbar/sideNavBar'
import { validateToken } from '@/utils/helper'
import Link from 'next/link'
const About = () => {
  useEffect(()=> {
    validateToken()
  }, [])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
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

        {/* About Page */}
        <div className={style.contentdiv}>
          <div>
            <h1 className={style.title}>Our Main Goal</h1>
            <p className={style.text}>We guarantee you to improve your career development 
            <br/>from our mentors' guidance and support <br/>Aiming to contribute positively to society's progress <br/>together with you </p>
            <div className={style.aboutdiv}>
              <div className={style.left}>
                <img src="../../assets/images/guide.svg" alt="Guiding image" width="500px"/>
              </div>
              <div className={style.right}>
                <p className={style.text2}>" Guiding your journey <br/>with the perfect mentor match " </p>
              </div>
          </div>
          <Footer/>
          </div>
        </div>

      </div>
    
  )
}

export default About

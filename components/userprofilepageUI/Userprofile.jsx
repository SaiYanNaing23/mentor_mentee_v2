'use client'
import React, { useEffect } from 'react'
import style from '@/components/userprofilepageUI/userprofile.module.css'
import SideNavBar from '../navbar/sideNavBar'
import { validateToken } from '@/utils/helper'
import { useAuthStore } from '@/store/auth'
const Userprofile = () => {
    const { user, authCheck } = useAuthStore()
    useEffect(()=>{
        validateToken()
        authCheck()
    },[])
  return (
    <div className={style.maindiv}>
        {/* Side Nav bar */}
        <SideNavBar/>

        {/* User Profile Page */}
        { user && (
        <div className={style.contentdiv}>
            {/* Profile div */}
            <div className={style.profilediv}>
                <div className={style.left}>
                    <img src="../../assets/images/femaleprofile.svg" alt="User Profile" className={style.profileimg}/>
                </div>
                <div className={style.right}>
                    <p className={style.name}> { user.username } </p>
                    <p className={style.jobtitle}> { user.job_title } </p>
                </div>
            </div>

            <hr className={style.line}/>

            {/* Bio and Background */}
            <div className={style.infodiv}>
                <div className={style.bio}>
                    <h1 className={style.title}>Bio</h1>
                    <p className={style.text}> { user.bio }</p>
                </div>

                <h1 className={style.title}>Skills</h1>
                <ul>
                    { user.skills && user.skills.map((skill)=> (
                        <li className='text-[18px] mb-6 ' key={skill} >
                            {"=>"} { skill }
                        </li>
                    )) }
                </ul>

                <h1 className='text-[22px] font-bold mb-5 mt-16 ' >Profiency Level</h1>
                <p className='my-5 text-[18px] ' > { user.experience }</p>
            
            </div>
        </div>
        )}

    </div>
  )
}

export default Userprofile

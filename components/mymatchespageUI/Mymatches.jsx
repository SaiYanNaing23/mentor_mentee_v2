'use client'
import React, { useEffect, useState } from 'react'
import style from '@/components/mymatchespageUI/mymatches.module.css'
import SideNavBar from '../navbar/sideNavBar'
import { useAuthStore } from '@/store/auth';
import moment from "moment";
import Link from 'next/link';
import { validateToken } from '@/utils/helper';




const Mymatches = () => {
    const { authCheck } = useAuthStore()
    const [ userSchedules, setUserSchedules ] = useState([]);
    const [ myMatches, setMyMatches ] = useState([]);

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
        <SideNavBar/>

        {/* My Matches Page */}
        <div className={style.contentdiv}>
            {/* My Schedule */}
            <div className={style.schedule}>
                <h1 className={style.title}>My Schedule</h1>

                {userSchedules.length > 0 ? (
                    userSchedules.map((schedule) => (
                        <div className={style.text} key={schedule.mentor_id}>
                            <p>You have a session with <b>{schedule.mentor_name}</b></p><br/>
                            <p className='mb-5' >
                                Meeting will start from 
                                <b> {moment(schedule.start_time).format("h:mm A")} to {moment(schedule.end_time).format("h:mm A")} </b> 
                                on <b>{moment(schedule.start_time).format("MMMM Do, YYYY")}</b>
                            </p>
                            <div className='flex gap-5 mb-8 mt-3' >
                                <p>
                                    <b>Google meeting link is </b>
                                </p>
                                <Link href={moment().isBetween(schedule.start_time, schedule.end_time) ? schedule.meeting_link : '#'} className={moment().isBetween(schedule.start_time, schedule.end_time) ? '' : 'text-gray-500 cursor-not-allowed'} >
                                    {schedule.meeting_link}
                                </Link>
                            </div>
                            <p>This link will be only available when it reaches the given session time</p>
                        </div>
                    ))
                ) : (
                    <div>
                        Loading my schedules
                    </div>
                )}
                
                
            </div>

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
                        <div>
                            Loading Mentor data ...
                        </div>
                    )}
                    
                </div>

            </div>

        </div>

    </div>
  )
}

export default Mymatches

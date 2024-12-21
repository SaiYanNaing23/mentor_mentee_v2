'use client'
import React, { useEffect, useState } from 'react'
import style from '@/components/dashboardpageUI/dashboard.module.css'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react'
// import axios from 'axios';
import SideNavBar from '../navbar/sideNavBar'
import { validateToken } from '@/utils/helper'
import inputStyle from '@/components/loginpageUI/login.module.css';
import moment from 'moment';
import { useAnnouncementStore } from '@/store/announcement'
import { useAuthStore } from '@/store/auth'
import scheduleStyle from '@/components/mymatchespageUI/mymatches.module.css'
import Link from 'next/link'
import axios from 'axios'
import Cookies from 'js-cookie'
import {Card, CardHeader, CardBody, CardFooter, Divider, Image} from "@nextui-org/react";

const Sidenav = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [ announcementTitle, setAnnouncementTitle ] = useState('')
  const [ announcementContent, setAnnouncementContent ] = useState('')
  const { fetchAnnouncement, announcement, createAnnouncement, deleteAnnouncement } =  useAnnouncementStore()
  const { authCheck, user } = useAuthStore()

  const [ userSchedules, setUserSchedules ] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const onCreateAnnouncementHandler = () => {
    try {
      let credentials = {
        title : announcementTitle,
        content : announcementContent,
        date : new Date()
      }
      createAnnouncement(credentials).then((_)=> {
        fetchAnnouncement()
      })
      onOpenChange(false)
      setAnnouncementTitle('')
      setAnnouncementContent('')
      
    } catch (error) {
      console.error(error)
      onOpenChange(false)
      setAnnouncementTitle('')
      setAnnouncementContent('')
    }
  }

  const onDeleteAnnouncementHandler = (id) => {
    deleteAnnouncement({ id }).then((_) => {
      fetchAnnouncement()
    })
  }

  const removeExpiredSchedules = async () => {
    try {
      const token = Cookies.get('token');
      await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/schedule/remove`,{
        headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
        }
    }).then((_)=> {
      authCheck().then(()=> {
        const schedule = useAuthStore.getState().user.mySchedules;
        setUserSchedules(schedule || []);
      })
    })
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(()=>{
    validateToken()
    removeExpiredSchedules()
    fetchAnnouncement()
  }, [])
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

      {/* Dashboard Page */}
      <div className={style.contentdiv} >
        {/* Welcome Div */}
        <div className={style.welcomediv}>
          <div className={style.leftdiv}>
            <h1 className={style.maintitle}>Glad you're here !</h1>
            <h3 className={style.text}>Success starts with the right mentor<br/>
            Begin your match-making journey!</h3>
          </div>
          <div className={style.rightdiv}>
          <img src="../../assets/images/dashboard.svg" alt="Profile icon" width="550px"/><br/>
          </div>
        </div>

        {/* My Schedule */}
        <div className={scheduleStyle.schedule}>
            <h1 className={scheduleStyle.title}>My Schedule</h1>
              {userSchedules.length > 0 ? (
                  userSchedules.map((schedule) => (
                      <div className={scheduleStyle.text} key={schedule.mentor_id}>
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
                  <div className='py-[64px] ps-[50px] text-[18px] font-bold'>
                    <p>
                      You have no scheduled meeting yet. Choose a mentor and book a session ! 
                    </p>
                  </div>
              )}
          </div>

        {/* Feed back */}
        <div className='my-[84px]' >
          <h1 className={style.title}>Hear From Our Users </h1>
          <div className='lg:flex lg:justify-around' >
            {/* 1st mentee */}
            <Card className="xl:max-w-[350px] lg:max-w-[250px] my-[64px] ">
              <CardHeader className="flex gap-3">
                <Image
                  alt="nextui logo"
                  height={100}
                  radius="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  width={100}
                  className='lg:w-[150px] '
                />
                <div className="flex flex-col ml-8">
                  <p className="lg:text-[18px] md:text-[16px] font-bold  ">Ethan Collin</p>
                  <p className="lg:text-[18px] md:text-[12px] text-default-500 mt-3">Security engineer at Nextrix </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className='p-5 text-[16px] leading-9 ' >The mentor I was matched with is not just an expert in my field but also someone who truly cares about my growth. This connection is more valuable than I imagined, and I’m so grateful for the recommendation!</p>
                
              </CardBody>
              <Divider />
              {/* <CardFooter>
              </CardFooter> */}
            </Card>

            {/* 2nd mentee */}
            <Card className="xl:max-w-[350px] lg:max-w-[250px] my-[64px] ">
              <CardHeader className="flex gap-3">
                <Image
                  alt="nextui logo"
                  height={100}
                  radius="sm"
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                  width={100}
                />
                <div className="flex flex-col ml-8">
                  <p className="lg:text-[18px] md:text-[16px] font-bold ">Liam</p>
                  <p className="lg:text-[18px] md:text-[12px] text-default-500 mt-3">Clicinal data analyst</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className='p-5 text-[16px] leading-9 ' >The mentor I was matched with perfectly aligned with my career goals. Their guidance on improving my skills and preparing for interviews was invaluable. I couldn't have found a better mentor!</p>
                
              </CardBody>
              <Divider />
              {/* <CardFooter>
              </CardFooter> */}
            </Card>

            {/* 3rd mentee */}
            <Card className="xl:max-w-[350px] lg:max-w-[250px] my-[64px] ">
              <CardHeader className="flex gap-3">
                <Image
                  alt="nextui logo"
                  height={100}
                  radius="sm"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  width={100}
                />
                <div className="flex flex-col ml-8">
                  <p className="lg:text-[18px] md:text-[16px] font-bold ">Khine Kyi Phyu Lin</p>
                  <p className="lg:text-[18px] md:text-[12px] text-default-500 mt-3">Digital artist at FunTech</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className='p-5 text-[16px] leading-9 ' >I didn’t expect the mentor suggestions to be this accurate. Within just a few sessions, my mentor helped me organize my career path and taught me how to network effectively.</p>
                
              </CardBody>
              <Divider />
              {/* <CardFooter>
              </CardFooter> */}
            </Card>
          </div>
        </div>

        {/* Announcement Div */}
        <div className='pb-[120px]' >
            <h1 className={style.title}>Announcement</h1>
            {/* admin@gmail.com */}
            {user && user.email && user.email === 'admin@gmail.com' && (
              <div className='flex justify-end mb-5 ' >
                <Button onClick={onOpen} className='text-[16px] !py-8 px-5 ' color='primary' >
                  Create Announcement
                </Button>
              </div>
            )}
            <div className='border border-[#00206B] rounded-3xl py-11 px-5 ' >
              <div className=' p-[20px] min-h-[360px] overflow-y-scroll no-scrollbar' >
                { announcement.length ? (
                  <div>
                     { announcement.map((announcement)=> (
                        <div className='flex mb-[20px] justify-between border-b-1 border-[#6b6b6c] pb-8 ' key={announcement._id} >
                          <div className='w-[75%]' >
                            <h1 className={style.announcetitle}> {announcement.title} </h1><br/>
                            <p className={style.announcetext}> {announcement.content} </p>
                          </div>
                          <div className='w-[25%] text-right pr-5' >
                            {user && user.email && user.email === 'admin@gmail.com' && (
                              <Button onClick={() => onDeleteAnnouncementHandler(announcement._id)} className='text-[16px] !py-5 px-5 mb-3 ' >
                                Delete
                              </Button>
                            )}
                            <p className={style.announcedate}> {moment(announcement.date).format('MMM Do')} </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <h1 className='flex items-center justify-center text-[18px] font-bold ' >
                    Currently there's no announcement!
                  </h1>
                )}
               
              </div>
            </div>
        </div>
      </div> 

    </div>
  )
}

export default Sidenav;

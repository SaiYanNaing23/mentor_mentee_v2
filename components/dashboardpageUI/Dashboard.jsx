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



const Sidenav = () => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [ announcementTitle, setAnnouncementTitle ] = useState('')
  const [ announcementContent, setAnnouncementContent ] = useState('')
  const { fetchAnnouncement, announcement, createAnnouncement, deleteAnnouncement } =  useAnnouncementStore()
  const { authCheck, user } = useAuthStore()

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
  useEffect(()=>{
    validateToken()
    authCheck()
    fetchAnnouncement()
  }, [])
  return (
    <div className={style.maindiv}>
      {/* Side Nav bar */}
      <SideNavBar/>

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

        {/* Blogs Div */}
        {/* <div className='py-[96px]' >
          <h1 className={style.title}>Blogs</h1>
          <div className={style.blogsdiv}>
            <div className={style.blog}>
              <img src="../../assets/icons/profile.svg" alt="Profile icon" width="30px"/><br/>
              <h3 className={style.blogtitle}>Blog One Title</h3><br/>
              <img src="../../assets/images/testing.svg" alt="Testing Image" width="400px"/>
            </div>
            <div className={style.blog}>
              <img src="../../assets/icons/profile.svg" alt="Profile icon" width="30px"/><br/>
              <h3 className={style.blogtitle}>Blog Two Title</h3><br/>
              <img src="../../assets/images/testing.svg" alt="Testing Image" width="400px"/>
            </div>
            <div className={style.blog}>
              <img src="../../assets/icons/profile.svg" alt="Profile icon" width="30px"/><br/>
              <h3 className={style.blogtitle}>Blog Three Title</h3><br/>
              <img src="../../assets/images/testing.svg" alt="Testing Image" width="400px"/>
            </div>
          </div>
        </div> */}

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

      

    {/* Models */}
    <Modal 
     isOpen={isOpen} 
     onOpenChange={onOpenChange}
    >
        <ModalContent style={{ width: '500px', maxWidth: '800px' }}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[18px] ">Create Announcement</ModalHeader>
              <ModalBody>
                <label>Title</label>
                <input type="text" className={inputStyle.input} style={{width: "100%"}} value={announcementTitle} onChange={(e)=> setAnnouncementTitle(e.target.value)} />
                <label>Text Area</label>
                <textarea 
                  id="bio" 
                  rows="5" 
                  className={style.input} 
                  style={{ width: '100%', height: '150px', border: '1px solid #000' }} 
                  value={announcementContent} 
                  onChange={(e) => setAnnouncementContent(e.target.value)} ></textarea>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" className='text-[16px] !py-8 px-5 ' variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" className='text-[16px] !py-8 px-5 ' onPress={onCreateAnnouncementHandler}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
    </Modal>

    </div>
  )
}

export default Sidenav;

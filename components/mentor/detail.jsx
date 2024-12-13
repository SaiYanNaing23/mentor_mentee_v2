"use client";
import React, { useEffect, useState } from 'react'
import style from '@/components/aboutpageUI/about.module.css'
import SideNavBar from '../navbar/sideNavBar'
import { useMentorStore } from '@/store/mentor';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from "js-cookie";
import moment from "moment";
import { toast } from 'sonner';
import Link from 'next/link';


const detail = () => {
    const { mentors, agreementMutation, fetchMentorDetails } = useMentorStore()
    const [ agree, setAgree ] = useState(false)
    const [ confirm, setConfirm] = useState(false)
    const [ isUpdating, setIsUpdating ] = useState(false)
    const [ schedulesForMentee, setSchedulesForMentee ] = useState([])
    const [ isBooking, setIsBooking ] = useState(false)
    const { authCheck, user } = useAuthStore(); 
    const router = useRouter()
    const token = Cookies.get("token");
    const alreadyChosen = 'You have booked a session with this mentor.';
    const code = Cookies.get("code");
    const scope = Cookies.get("scope");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const generateMeetingSchedule = (numOfDays = 1) => {
        const schedule = [];
        
        const timeSlots = [
          { start: 1, end: 2 },
          { start: 3, end: 4 },
          { start: 5, end: 6 },
          { start: 7, end: 8 },
          { start: 9, end: 10 },
          { start: 11, end: 12 },
        ];
        
        for (let i = 0; i < numOfDays; i++) {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + i);  
          currentDate.setUTCHours(0, 0, 0, 0);  
      
         
          timeSlots.forEach(slot => {
            const startDate = new Date(currentDate);
            startDate.setUTCHours(slot.start, 0, 0, 0);  
            
            const endDate = new Date(startDate);
            endDate.setUTCHours(slot.end, 0, 0, 0);  
      
            schedule.push({
              startDate: startDate.toISOString(), 
              endDate: endDate.toISOString()      
            });
          });
        }
        console.log("schedule", schedule)
        setSchedulesForMentee(schedule.slice(6,12))
        return schedule;
      };

    useEffect(() => {
        authCheck()
        generateMeetingSchedule(2)
    }, [authCheck]);
    
    const handleCheckboxChange = (e) => {
        setAgree(e.target.checked);
      };
    const handleCheckboxConfirmChange = (e) => {
        setConfirm(e.target.checked);
    }
    const onConfirmationHandler = () => {
        try {
            setIsUpdating(true)
           
            let variables = {
                mentee_id : user._id,
                mentor_id : mentors._id
            }
            agreementMutation(variables).then((_)=> {
                setIsUpdating(false)
                onOpenChangeConfirmation(false)
                onOpenSuccess(true);
            })
        } catch (error) {
            setIsUpdating(false)
            onOpenChangeConfirmation(false)
            console.error(error)
        }
    
    }

    const onSuccessHandler = () => {
        try {
            onOpenChangeSuccess(false)
            let variables = {
                id : mentors._id
            }
            fetchMentorDetails(variables)
        } catch (error) {
            console.error(error)
        }
    }

    const [selectedSchedule, setSelectedSchedule] = useState([]);

    const handleHourClick = (schedule) => {
        if (selectedSchedule.some((s) => s.startDate === schedule.startDate)) {
          // If already selected, remove it
          setSelectedSchedule((prev) =>
            prev.filter((s) => s.startDate !== schedule.startDate)
          );
        } else {
          // Add it if not selected
          setSelectedSchedule((prev) => [...prev, schedule]);
        }
      };

    const onLoginGoogleHandler = async () => {
        try {
            Cookies.set('mentor_id', mentors._id )
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/mentor/login-auth`,{
                headers: { 
                    Authorization: `Bearer ${token}` 
                },
            })
            console.log(data)
            router.push(data.google_auth_url)
        } catch (error) {
            console.log(error)
        }
    }

    const onBookingHandler = async () => {
        try {
            setIsBooking(true)
            let credentials = {
                summary: "Team Meeting",
                description: "Discussing project updates and timelines.",
                startTime: selectedSchedule[0].startDate,
                endTime: selectedSchedule[0].endDate,
                attendees: ["admin@gmail.com", user.email],
                user_id: user._id,
                mentor_id : mentors._id,
            }
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/mentor/google-handle-callback`,{code}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                },
            })
            if(res.data.success){
                const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/mentor/generate-meeting-link`, credentials, {
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    },
                })
                if(data.success){
                    let variables = {
                        id : mentors._id
                    }
                    fetchMentorDetails(variables)
                }
                toast.success('Success', {
                    description: "You have successfully booked with these mentor."
                })
            }
            setIsBooking(false)
        } catch (error) {
            setIsBooking(false)
            console.log(error)
            toast.error('Error', {
                description: error
            })
        }
    }


    const {isOpen : isOpenConfirmation, onOpen : onOpenConfirmation, onOpenChange : onOpenChangeConfirmation} = useDisclosure();
    const {isOpen : isOpenSuccess, onOpen : onOpenSuccess, onOpenChange : onOpenChangeSuccess} = useDisclosure();

    
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

            <div className='w-full p-28 overflow-scroll ' >
                <div className='flex gap-10 items-center border-b-3 pb-24  '  >
                    <img src="../../assets/images/profile.svg" alt="profile" width={150} height={150} className='rounded-full ' />
                    <p className='flex flex-col xl:text-[32px] text-[16px] lg:text-[18px] font-bold ' >
                        <span className='inline-block mb-5 '  >
                            {mentors.name}
                        </span>
                        <span className='inline-block  '  >
                            {mentors.job_title}
                        </span>
                       
                    </p>
                </div>
                <div className='flex justify-between mentor-detail-warp ' >
                    <div className='flex flex-col p-8 w-1/2 mentor-detail-warp-des ' >

                        {/* Description */}
                        <h2 className='xl:text-[24px] text-[16px] lg:text-[18px] font-bold mb-6' >
                            Description
                        </h2>
                        <p className='w-full xl:text-[18px] text-[12px] lg:text-[14px] leading-10  ' >
                            {mentors.bio}
                        </p>

                        {/* Skills */}
                        <h2 className='xl:text-[24px] text-[16px] lg:text-[18px] font-bold mb-6 mt-10 ' >
                            Skills
                        </h2>
                        <ul className='w-full xl:text-[18px] text-[12px] lg:text-[14px] leading-10 ' >
                            { mentors && mentors.skills && mentors.skills.map((skill)=> (
                                <li className='mb-5' key={skill} >
                                   {"=>"} { skill }
                                </li>
                            ))}
                            
                        </ul>

                        {/* Company */}
                        <h2 className='xl:text-[24px] text-[16px] lg:text-[18px] font-bold mb-6 mt-10 ' >
                            Current Working Company
                        </h2>
                        <p className='w-full xl:text-[18px] text-[12px] lg:text-[14px] leading-10' >
                            { mentors.job_title } at { mentors.company }
                        </p>

                    </div>
                    {/* Card */}
                    {mentors.agreedMenteeIds?.includes(user?._id) ? (
                        <div>
                            {mentors.bookedMenteeIds?.includes(user?._id) ? (
                                <div className="border-3 rounded-2xl p-12 -mt-20 mr-10 min-w-[35%] bg-white mentor-detail-warp-agree">
                                    <h3 className="xl:text-[18px] text-[12px] font-bold text-center" >Already Chosen</h3>
                                    <p className='mt-5 xl:text-[16px] text-[12px] text-center ' >{alreadyChosen}</p>
                                    <div className='flex justify-center mt-10' >
                                        <Link href='/matches' >
                                            <Button className="!text-[18px] !py-[20px] !px-[25px] mr-5 mb-8" color='primary' >
                                                View Your Booking
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-3 rounded-2xl p-12 -mt-20 mr-10 min-w-[35%] bg-white mentor-detail-warp-agree">
                                <h3 className="xl:text-[18px] text-[12px]  font-bold text-center">Choose Schedules</h3>
                                {schedulesForMentee.length > 0 ? (
                                <div className='grid sm:grid-cols-2 grid-cols-1 mt-9 gap-3 ' >
                                    {schedulesForMentee.map((schedule, index) => {
                                    const isSelected = selectedSchedule.some(
                                        (s) => s.startDate === schedule.startDate
                                    );
    
                                    return (
                                        <Button
                                        key={index}
                                        color={isSelected ? "success" : "primary"}
                                        className="xl:text-[18px] text-[12px] !py-[20px] !px-[25px] xl:px-[40px] mr-5 mb-8"
                                        isDisabled={selectedSchedule.length > 0 && !isSelected}
                                        onClick={() => handleHourClick(schedule)}
                                        >
                                            Tomorrow {moment(schedule.startDate).format("h:mm A")}
                                        </Button>
                                    );
                                    })}
                                </div>
                                
                                ) : (
                                <div>Wait to Generate Schedule</div>
                                )}
                                <div className='flex justify-center mt-10 ' >
                                    <Button color='warning' onClick={onLoginGoogleHandler} className='sm:text-[18px] !py-[20px] !px-[25px] mr-5 mb-8  ' >
                                        Login To Google
                                    </Button>
                                    <Button
                                        color='secondary'
                                        className="sm:text-[18px] !py-[20px] !px-[25px] mr-5 mb-8  "
                                        onClick={onBookingHandler}
                                        isDisabled={!selectedSchedule.length || code == undefined || scope == undefined}
                                        isLoading={isBooking}
                                    >
                                        Book
                                    </Button>
                                </div>
                            </div>
                            ) }
                        </div>
                        
                    ) : 
                    (<div className='border-3 rounded-2xl xl:p-12 p-5 -mt-20  mr-10 min-w-[35%] bg-white !h-[30%] mentor-detail-warp-agree ' >
                        <h3 className='xl:text-[18px] text-[12px] font-bold text-center ' >Rules & Regulations </h3>
                        <ul className='xl:text-[16px] text-[12px] leading-8 my-8 ' >
                            <li>
                                - Must respect mentor's time and availability
                            </li>
                            <li className='mt-5' >
                                - No last-minute cancellation is accepted
                            </li>
                            <li className='mt-5' >
                                - Must attend sessions punctually 
                            </li>
                            <li className='mt-5' >
                                - Be clear about goals and expectations 
                            </li>
                            <li className='mt-5' >
                                - Maintain professionalism and respect boundaries 
                            </li>
                        </ul>
                        <div className='flex items-center gap-4 mt-5 text-[12px] xl:text-[16px] ' >
                            <input id='agree' onChange={handleCheckboxChange}  className='size-6' type="checkbox"/>
                            <label htmlFor="agree">Agree to Rules and Regulations </label>
                        </div>
                        <div className='flex justify-end gap-4 mt-8 ' >
                        <Button color="primary" size='lg' onPress={onOpenConfirmation} isDisabled={!agree} className='text-[16px] py-8 px-11 '  >
                            Confirm
                        </Button>
                        </div>
                    </div>)
                     }
                    
                </div>
            </div>


            {/* Modals */}
            <Modal isOpen={isOpenConfirmation} size='2xl' className={{body : 'py-6'}} onOpenChange={onOpenChangeConfirmation}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 text-[18px] ">Confirmation</ModalHeader>
                    <ModalBody>
                        <p> 
                        Click the checkbox if you are connecting with this mentor and start a session for your learning journey. 
                        </p>
                        <p className='flex items-center gap-4 mt-3 ' >
                            <input id='confirm' onChange={handleCheckboxConfirmChange}  className='size-6' type="checkbox"/>
                            <label htmlFor="confirm">I confirm to match with (connect to) this mentor</label>
                         
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" size='lg' variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button color="primary" isLoading={isUpdating} size='lg' isDisabled={!confirm} onPress={() => onConfirmationHandler(onClose)}>
                            Confirm
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            {/* Success */}
            <Modal isOpen={isOpenSuccess} size='2xl' className={{body : 'py-6'}} onOpenChange={onOpenChangeSuccess}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 text-[18px] ">Matching Successful !</ModalHeader>
                    <ModalBody>
                        <p> 
                            Congratulations !                         
                        </p>
                        <p  >
                            You're successfully connected to this mentor. Book a session to start !
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" size='lg' variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button color="primary" size='lg' onPress={onSuccessHandler}>
                            Book a session
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default detail

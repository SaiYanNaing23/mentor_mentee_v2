'use client'
import React, { useEffect, useState } from 'react'
import style from '@/components/userprofilepageUI/userprofile.module.css'
import SideNavBar from '../navbar/sideNavBar'
import { validateToken } from '@/utils/helper'
import { useAuthStore } from '@/store/auth'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import inputStyle from '@/components/loginpageUI/login.module.css';
import { useProfileStore } from '@/store/profile'

const Userprofile = () => {
    const {isOpen : isOpenCreate, onOpen : onOpenCreate, onOpenChange : onOpenChangeCreate} = useDisclosure();
    const {isOpen : isOpenAddSkill, onOpen : onOpenAddSkill, onOpenChange : onOpenChangeAddSkill} = useDisclosure();


    const [ name, setName ] = useState('');
    const [ jobTitle, setJobTitle ] = useState('');
    const [ bio, setBio ] = useState('');
    const [ experience, setExperience ] = useState('');
    const [ userInfo, setUserInfo ] = useState([])
    const [ skill, setSkill ] = useState('');

    const { user, authCheck } = useAuthStore()

    const { updateUserProfile, addSkill } = useProfileStore()

    const onAddSkillHandler = () => {
        try {
            addSkill({
                user_id : useAuthStore.getState().user._id,
                skill : skill,
            })
            authCheck()
            onOpenChangeAddSkill(false);
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
        
    }
    useEffect(()=>{
        validateToken()
        authCheck().then((_)=> {
            setUserInfo(useAuthStore.getState().user)
            setName(useAuthStore.getState().user.username)
            setJobTitle(useAuthStore.getState().user.job_title)
            setBio(useAuthStore.getState().user.bio)
            setExperience(useAuthStore.getState().user.experience)
        })
    },[])

    const onUpdateProfileHandler = () => {
        let credentials = {
            user_id : useAuthStore.getState().user._id,
            username : name || null,
            job_title : jobTitle || null,
            bio : bio || null,
            experience : experience || null,
        }
        onOpenChangeCreate(false)
        updateUserProfile(credentials)
        authCheck().then((_)=> {
            console.log(useAuthStore.getState().user)
            setUserInfo(useAuthStore.getState().user)
            setName(useAuthStore.getState().user.username)
            setJobTitle(useAuthStore.getState().user.job_title)
            setBio(useAuthStore.getState().user.bio)
            setExperience(useAuthStore.getState().user.experience)
        })
        window.location.reload()
        console.log("credentials", credentials);
    }
  return (
    <div className={style.maindiv}>
        {/* Side Nav bar */}
        <SideNavBar/>

        {/* User Profile Page */}
        { userInfo && (
        <div className={style.contentdiv}>
            {/* Profile div */}
            <div className={style.profilediv}>
                <div className={style.left}>
                    <img src="../../assets/icons/profilev2.svg" alt="User Profile" className={style.profileimg}/>
                </div>
                <div className={style.right}>
                    <div className='flex flex-col justify-start' >
                        <p className={style.name}> { userInfo.username } </p>
                        <p className={style.jobtitle}> { userInfo.job_title } </p>
                        <div className='text-start flex gap-5 items-center' >
                            <Button onPress={onOpenCreate} className='text-[18px] mt-5 !py-7  w-[20%]  ' color='primary' >Edit Profile</Button>
                            <Button onPress={onOpenAddSkill} className='text-[16px] mt-5  !py-7 text-start w-[20%] ' color='primary'  >
                                Add Skill
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <hr className={style.line}/>

            {/* Bio and Background */}
            <div>
                <div>
                    <h1 className={style.title}>Bio</h1>
                    <p className={style.text}> { userInfo.bio }</p>
                </div>
             
                <h1 className={style.title}>Skills</h1>

                <ul>
                    { userInfo.skills && userInfo.skills.map((skill)=> (
                        <li className='text-[18px] mb-6 ' key={skill} >
                            {"=>"} { skill }
                        </li>
                    )) }
                </ul>

                <h1 className='text-[22px] font-bold mb-5 mt-16 ' >Profiency Level</h1>
                <p className='my-5 text-[18px] ' > { userInfo.experience }</p>
            
            </div>
            
            <Modal isOpen={isOpenCreate} onOpenChange={onOpenChangeCreate}>
                <ModalContent style={{ width: '500px', maxWidth: '800px' }}>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 text-[18px] font-bold ">Edit Profile</ModalHeader>
                    <ModalBody className='text-[16px]  ' >
                        <label> User Name </label>
                        <input type="text" value={name} className={inputStyle.input} style={{ width : "100%"}} onChange={(e) => setName(e.target.value)} />

                        <label> Job Title </label>
                        <input type="text" value={jobTitle} className={inputStyle.input} style={{ width : "100%"}} onChange={(e) => setJobTitle(e.target.value)} />

                        <label> Bio </label>
                        <textarea 
                            rows="5" 
                            className={style.input} 
                            style={{ width: '100%', height: '150px', border: '1px solid #000' }} 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} ></textarea>

                        <label className='mt-5' > Profiency Level </label>
                        <input type="text" className={inputStyle.input} value={experience} style={{ width : "100%"}} onChange={(e) => setExperience(e.target.value)} />
                        
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" className='text-[16px] mt-5 !py-7' onPress={onClose}>
                            Close
                        </Button>
                        <Button color="primary" className='text-[16px] mt-5 !py-7' onPress={onUpdateProfileHandler}>
                            Confirm
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenAddSkill} onOpenChange={onOpenChangeAddSkill}>
                <ModalContent style={{ width: '500px', maxWidth: '500px' }}>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1 text-[18px] font-bold ">Add Skill</ModalHeader>
                    <ModalBody className='text-[16px]  ' >
                        <label> Skill </label>
                        <input type="text" value={skill} className={inputStyle.input} style={{ width : "100%"}} onChange={(e) => setSkill(e.target.value)} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" className='text-[16px] mt-5 !py-7' onPress={onClose}>
                            Close
                        </Button>
                        <Button color="primary" className='text-[16px] mt-5 !py-7' onPress={onAddSkillHandler}>
                            Confirm
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

        </div>
        )}

    </div>
  )
}

export default Userprofile

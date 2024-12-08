'use client';
import React from 'react'
import style from '@/components/dashboardpageUI/globalnav.module.css'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { Button } from '@nextui-org/react';

const Globalnav = () => {
  const router = useRouter()
  const { logout } = useAuthStore();

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem('authToken');
    // Reset the auth store state
    logout(); 
    // Redirect to login page
    router.push('/login'); 
  };

  return (
    <div className={style.nav}>
        <div className={style.logodiv}>
            <Link href='/' >
              <img src="../../assets/images/main_logo.png" alt="Main Logo" width="100px"/>
            </Link>
        </div>
        <div className={style.btndiv}>
            <Link href='/explore' >
              <Button color='primary' className='text-[18px] py-8 px-5 '  >
                Browse Mentor
              </Button>
            </Link>
            <Button className='text-[18px] py-8 px-5 ml-8' onClick={handleLogout}  >
              Logout
            </Button>
        </div>
    </div>
  )
}

export default Globalnav

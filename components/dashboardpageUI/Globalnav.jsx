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
    router.push('/initial'); 
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
              <Button color='primary' className={style.browse}>
                Browse Mentor
              </Button>
            </Link>
            <Button className={style.logout} onClick={handleLogout}  >
              Log Out
            </Button>
        </div>
    </div>
  )
}

export default Globalnav

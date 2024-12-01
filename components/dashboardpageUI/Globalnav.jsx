'use client';
import React from 'react'
import style from '@/components/dashboardpageUI/globalnav.module.css'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth';

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
            <img src="../../assets/images/main_logo.png" alt="Main Logo" width="100px"/>
        </div>
        <div className={style.btndiv}>
            <button onClick={() => router.push('./explore')} className={style.browse}>
              Browse Mentor
            </button>
            <button onClick={handleLogout} className={style.logout}>
              Logout
            </button>
        </div>
    </div>
  )
}

export default Globalnav

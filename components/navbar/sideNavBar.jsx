import React from 'react';
import style from '@/components/dashboardpageUI/dashboard.module.css';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth'; // Assuming you're using Zustand for authentication

const sideNavBar = () => {
  const { user } = useAuthStore(); // Access the user from your authentication store

  return (
    <div>
      <div className={style.sidenav}>
        <ul className={style.items}>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/explore">Explore</Link>
          </li>
          <li>
            <Link href="/matches">My Matches</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
        <div className={style.profilediv}>
          <Link href="/profile">
            <img src="../../assets/icons/profile.svg" alt="Profile icon" width="50px" />
          </Link>
          {user?.email && (
            <div className="mt-2 text-[16px] font-bold text-black-700 text-center break-words">
              <p>{user.email.split('@')[0]}</p>
              <p>@{user.email.split('@')[1]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default sideNavBar;

"use client";
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

const Page = () => {
  const [mentors, setMentors] = useState([]);
  const { authCheck } = useAuthStore(); 
  const router = useRouter()

  useEffect(() => {
    authCheck().then(() => {
      const userFromStore = useAuthStore.getState().user.matchedWith;
      setMentors(userFromStore || []);
    });
  }, [authCheck]);

  const redirectMentorDetailHandler = (mentor) => {
    return router.push(`/mentor/detail/${mentor._id}`)
  }

  return (
    <div className="h-screen flex items-center justify-center relative flex-col ">
      <h1 className='-mt-[80px] mb-[70px] text-[24px] font-bold' >
        Recommended Mentors 
      </h1>
      <div>
        <div className='grid grid-cols-3 gap-12 ' >
          {/* Render mentors */}
          {mentors.length > 0 ? (
            mentors.map((mentor) => (
              <div key={mentor._id} className="bg-white w-[300px] mb-5 rounded-xl">
                <div className='p-6 text-center border-b flex justify-center ' >
                  <img src="/assets/images/profile.svg" alt="profile" width={180} height={180} />
                </div>
                <div className='p-6' >
                  <h1 className='mb-3' >
                    {mentor.name}
                  </h1>
                  <h1 className='mb-3' >
                    {mentor.career}
                  </h1>
                  <h1 className='mb-3' >
                    {mentor.job_title}
                  </h1>
                </div>
                <div className='flex justify-end mr-3 ' >
                  <Button
                      color='primary'
                      size="lg"
                      className="!text-[18px] !py-[8px] !px-[15px] mr-5 mb-8"
                      onClick={()=> redirectMentorDetailHandler(mentor)}
                    >
                      Show Info
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div>No mentors found</div>
          )}
        </div>
      </div>
      <div className='absolute bottom-20 right-20 ' >
        <Link href='/' >
          <Button 
            color="secondary"
            size="lg"
            className="!text-[18px] !py-[25px] !px-[15px]"
            
          >
            Go to Dashboard
          </Button>
        </Link>
        </div>
    </div>
  );
};

export default Page;

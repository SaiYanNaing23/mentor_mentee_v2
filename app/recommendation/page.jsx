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
    <div className="flex items-center justify-center relative flex-col">
      <div className="absolute top-5 left-5 flex items-center group">
        <Link href="/initial">
        <img src="../../assets/icons/home2.svg" alt="Home Logo" width="50px" />
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Go back to Initial Page
        </span>
        </Link>
      </div>
      <div>
        <h1 className='mt-[50px] mb-[20px] text-[24px] font-bold text-center' >
          Recommended Mentors 
        </h1>
        <p className='text-[18px] font-bold mb-[20px] mx-[50px] ' >
          The mentors shown below are Top 6 Mentors we recommend for you, who best match with your chosen career and skills.
        </p>
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:gap-12 md:gap-7 md:ml-[80px] sm:ml-[80px] ml-[30px] recommendation' >
          {/* Render mentors */}
          {mentors.length > 0 ? (
            mentors.map((mentor) => (
              <div key={mentor._id} className="bg-gray-100 lg:w-[280px] md:w-[200px] w-[250px] sm:[180px]  mb-5 rounded-xl">
                <div className='p-6 text-center border-b flex justify-center ' >
                  <img src="/assets/images/profile.svg" alt="profile" width={120} height={120} />
                </div>
                <div className='p-6' >
                  <h1 className='mb-3 font-bold' >
                    {mentor.name}
                  </h1>
                  <h1 className='mb-3' >
                    {mentor.career}
                  </h1>
                  <h1 className='mb-3' >
                    {mentor.job_title}
                  </h1>
                </div>
                <div className='flex justify-center mr-3 ' >
                  <Button
                      color='primary'
                      size="lg"
                      className="!text-[18px] !py-[8px] !px-[15px] mr-5 mb-8"
                      onClick={()=> redirectMentorDetailHandler(mentor)}
                    >
                      View more
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div>No mentors found</div>
          )}
        </div>
      </div>
      <div className='ml-auto mr-[30px] mb-[30px] ' >
        <Link href='/' >
          <Button 
            color="primary"
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

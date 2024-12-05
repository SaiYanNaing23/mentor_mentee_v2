'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";

const Page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const googleCallBack = async(code,scope) => {
    let credentials = {
        code,
        scope,
    }
    const token = Cookies.get('token');
    const mentor_id = Cookies.get('mentor_id');
    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/mentor/google-handle-callback`,credentials, {
        headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
        },
    })
    if(mentor_id){
      router.push(`/mentor/detail/${mentor_id}`)
      Cookies.remove('mentor_id')
      // window.location.reload();
    }
  }

  useEffect(() => {
    const code = searchParams.get('code'); // Get the 'code' parameter
    const scope = searchParams.get('scope'); // Get the 'scope' parameter

    // Store values in cookies
    if (code) {
      document.cookie = `code=${encodeURIComponent(code)}; path=/; max-age=3600;`;
    }
    if (scope) {
      document.cookie = `scope=${encodeURIComponent(scope)}; path=/; max-age=3600;`;
    }

    googleCallBack(code, scope)
  }, [pathname, searchParams]);

  return <div>Redirecting ...</div>;
};

export default Page;

'use client'
import React, { useState } from 'react'
import bgStyle from '@/components/loginpageUI/login.module.css'
import { Button } from '@nextui-org/react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import axios from 'axios'
const page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [ email, setEmail] = useState('');
    const [ password, setPassword ] = useState('');
    const { generatePassword } = useAuthStore()
    const router = useRouter();

    const onChangePasswordHandler = async () => {
      try {
        if(!email ||!password) return toast.error("Error", { description: "Please fill all Fields."})
        let credentials = {
          email : email,
          newPassword : password,
        }
        // generatePassword(credentials).then((_)=> {})
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/generate-password`,credentials).then((_)=> {
          toast.success("Success", {
            description : "Password is generated successfully."
          })
          router.push('/login');
          setPassword('')
          setEmail('')
        })
      } catch (error) {
        console.error("Login error: ", error.response?.data?.message || error.message);
        toast.error("Error", {
          description : error.response?.data?.message || error.message || "Something went wrong!"
        }) 
      }
     
    }

  return (
    <div className={bgStyle.wholediv} >
        <div className='w-[60%] lg:w-[30%] h-[320px] bg-white rounded-3xl p-10 forgot' >
            <label className='font-bold mb-5' >Email</label>
            <input type="text" className={bgStyle.input} style={{ width : '100%', display : 'block', marginTop: '14px'}} value={email} onChange={(e) => setEmail(e.target.value)} />

            <label className='font-bold mb-5' >Change Password</label>
            <input type={showPassword ? 'text' : 'password'} className={bgStyle.input} style={{ width : '100%', display : 'block', marginTop: '14px'}} value={password} onChange={(e) => setPassword(e.target.value)} />

            <input
                type="checkbox"
                id="showpsw"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label htmlFor="showpsw" className={bgStyle.showpsw}>Show password</label>
              
            <Button className='text-center flex justify-center w-[100%] text-[18px] font-bold py-8 px-5 mt-10' color='primary' onClick={onChangePasswordHandler} >
                Confirm
            </Button>
        </div>
    </div>
  )
}

export default page

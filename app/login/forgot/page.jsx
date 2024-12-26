'use client'
import React, { useState } from 'react'
import bgStyle from '@/components/loginpageUI/login.module.css'
import { Button } from '@nextui-org/react'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link';

const page = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { generatePassword } = useAuthStore()
    const router = useRouter();

    const validatePassword = (password) => {
        const minLength = password.length >= 6;
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);

        if (!minLength) {
            toast.error("Error", { description: "Password must be at least 6 characters" });
            return false;
        }
        if (!hasNumber) {
            toast.error("Error", { description: "Password must contain at least one number" });
            return false;
        }
        if (!hasSpecialChar) {
            toast.error("Error", { description: "Password must contain at least one special character" });
            return false;
        }
        if (!hasLetter) {
            toast.error("Error", { description: "Password must contain at least one letter" });
            return false;
        }
        return true;
    };

    const onChangePasswordHandler = async () => {
        try {
            if (!email || !password) {
                return toast.error("Error", { description: "Please fill all fields." });
            }

            if (!validatePassword(password)) {
                return;
            }

            const credentials = {
                email: email,
                newPassword: password,
            };

            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/generate-password`, credentials)
                .then(() => {
                    toast.success("Success", {
                        description: "Password is changed successfully."
                    });
                    router.push('/login');
                    setPassword('');
                    setEmail('');
                });
        } catch (error) {
            console.error("Password recovery error: ", error.response?.data?.message || error.message);
            toast.error("Error", {
                description: error.response?.data?.message || error.message || "Something went wrong!"
            });
        }
    };

    return (
        <div className={bgStyle.wholediv}>
            <div className="absolute top-5 left-5 flex items-center group">
                <Link href="/initial">
                    <img src="../../assets/icons/home.svg" alt="Home Logo" width="50px" />
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        Go back to Initial Page
                    </span>
                </Link>
            </div>
            <div className='w-[60%] lg:w-[30%] h-[380px] bg-white rounded-3xl p-10 forgot'>
                <h1 className='text-center text-[24px] font-extrabold mb-10 ml-5'>Recover password</h1>
                <label className='text-[18px] font-bold mb-5'>Email</label>
                <input
                    type="text"
                    className={bgStyle.input}
                    style={{ width: '100%', display: 'block', marginTop: '14px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className='text-[18px] font-bold mb-5'>Change Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    className={bgStyle.input}
                    style={{ width: '100%', display: 'block', marginTop: '14px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="checkbox"
                    id="showpsw"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                />
                <label htmlFor="showpsw" className={bgStyle.showpsw}>Show password</label>

                <Button
                    color='primary'
                    className='text-center flex justify-center w-[30%] ml-[35%] text-[16px] font-bold py-8 px-8 mt-5'
                    onClick={onChangePasswordHandler}
                >
                    Confirm
                </Button>
            </div>
        </div>
    );
};

export default page;

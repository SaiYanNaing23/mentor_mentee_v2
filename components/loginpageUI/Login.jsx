'use client';
import React, { useState } from 'react';
import style from '@/components/loginpageUI/login.module.css';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { toast } from 'sonner';

const Login = () => {
  const { login, user } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitLoginHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    // Basic validation
    if (!email.trim() || !password.trim()) {
      toast.error("Error", { description: "All fields are required" });
      setIsLoading(false);
      return;
    }

    const response = await login({ email, password });

    if (response?.success) {
      router.push('/'); 
      setIsLoading(false);
    } else {
      if (response?.message === 'Email not found') {
        toast.error("Error", {description: "Email not found"});
      } else {
        toast.error("Error", {description: "Invalid credentials"});
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={style.wholediv}>
      <div className={style.home}>
        <Link href='/initial'>
          <img src="../../assets/icons/home.svg" alt="Home Logo" width="50px" />
          <span className={`${style.tooltip}`}>Go back to Initial Page</span>
        </Link>
      </div>
      <div className={style.maindiv}>
        <div className={style.leftdiv}>
          <img src="../../assets/images/login_img1.svg" alt="Login Image" width="100%" />
        </div>
        <div className={style.rightdiv}>
          <h1 className={style.title}>Login</h1>
          <form className={style.form} onSubmit={onSubmitLoginHandler}>
            <label htmlFor="email" className={style.labels}>Email</label>
            <input
              type="email"
              id="email"
              className={style.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="psw" className={style.labels}>Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="psw"
              className={style.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={style.checkboxContainer}>
              <input
                type="checkbox"
                id="showpsw"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label htmlFor="showpsw" className={style.showpsw}>Show password</label>
            </div>
            <Button 
              type="submit" 
              color="primary" 
              className="text-center flex justify-center w-[30%] ml-[32%] text-[18px] font-bold py-8 px-5 mt-5" 
              isLoading={isLoading}
            >
              Log In
            </Button>
          </form>
          <div className={style.links}>
            <Link href="/login/forgot">Forgot password?</Link>
            <Link href='/login/signup'>
              Don't have an account? <br />Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

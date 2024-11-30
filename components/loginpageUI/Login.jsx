'use client';
import React, { useEffect, useState } from 'react';
import style from '@/components/loginpageUI/login.module.css';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

const Login = () => {
  const { login, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const onSubmitLoginHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    const response = await login({ email, password });
    
    if (response?.success) {
      localStorage.setItem('authToken', response?.token); 
      router.push('/'); 
    } else {
      setError(response?.message || 'Invalid credentials. Please try again.');
    }
};

  return (
    <div className={style.wholediv}>
      <div className={style.maindiv}>
        <div className={style.leftdiv}>
          <img src="../../assets/images/login_img1.svg" alt="Login Image" width="400px" />
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
            {error && <p className={style.error}>{error}</p>}
            <button type="submit" className={style.login}>Log In</button>
          </form>
          <div className={style.links}>
            <a href="#">Forgot password?</a>
            <a href="#">Don't have an account? <br />Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

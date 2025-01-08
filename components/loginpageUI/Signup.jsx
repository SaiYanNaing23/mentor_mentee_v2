'use client'
import { useEffect, useState } from "react"
import style from "@/components/loginpageUI/signup.module.css"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from "@/store/auth"
import { Button } from "@nextui-org/react"
import { toast } from "sonner"

const Signup = () => {
  const { user } = useAuthStore()
  const router = useRouter()
  useEffect(()=> {
    if(user){
      router.push('/buildingprofile')
      return
    }
  },[user])

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPw, setIsShowPw] = useState(false);
  const {isSignUp, signup} = useAuthStore()
  const [isLoading, setIsLoading] = useState(false);

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
  
  const onSubmitSignUpHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!email || !password) {
      toast.error("Error", { description: "Please fill all required fields" });
      setIsLoading(false);
      return;
    }
  
    if (!validatePassword(password)) {
      setIsLoading(false);
      return;
    }
  
    try {
      await signup({ email, password });
      toast.success("Success", { description: "Signup successful!" });
    } catch (error) {
      if (error.message === "Email already exists") {
        toast.error("Error", { description: "Email already exists" });
      } else {
        toast.error("Error", { description: "Something went wrong!" });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const showPassword = () =>{
    setIsShowPw(!isShowPw)
  }

  return (
    <div className={style.wholediv}>
      <div className={style.home}>
        <Link href='/initial' >
          <img src="../../assets/icons/home.svg" alt="Home Logo" width="50px"/>
          <span className={`${style.tooltip}`}>Go back to Initial Page</span>
        </Link>
      </div>
        <div className={style.maindiv}>
          <div className={style.leftdiv}>
            <img src="../../assets/images/sign_up.png" alt="SignUp Image" width="600px"/>
          </div>
          <div className={style.rightdiv}>
            <h1 className={style.title}>Sign Up</h1>

            <form className={style.form} onSubmit={onSubmitSignUpHandler} >

              <label htmlFor="email" className={style.labels}>Email</label>
              <input 
                type="email" 
                id="email" 
                className={style.input}
                placeholder='Enter Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="psw" className={style.labels}>Password</label>
              <input 
                type={isShowPw ? 'text' : 'password'} 
                id="psw" 
                className={style.input}
                placeholder='Enter Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center">
                <input type="checkbox" id="showpsw"/>
                <label htmlFor="showpsw" onClick={showPassword} className="cursor-pointer ml-3 " >Show password</label>
              </div>
              <div className="w-full text-center" >
                <Button color="primary" className="text-center flex justify-center w-[30%] ml-[30%] text-[18px] font-bold py-8 px-5 mt-5" isLoading={isLoading} type="submit" >Sign Up</Button>
              </div>
            </form>

            <div className="p-[30px] font-[500] text-center"  >
              <Link href="/login">Already have an account ? Log In</Link>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Signup

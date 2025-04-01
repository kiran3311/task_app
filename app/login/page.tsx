'use client'
import React, { useContext, useState, useEffect } from "react"
import { Button } from '@nextui-org/button';
import { Input } from "@nextui-org/react";
import axios from "axios";
import { apiUrl } from "@/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdroitLogo from '@/public/images/logo.png'
import { jwtDecode } from "jwt-decode";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";


import { toast, ToastContainer } from 'react-toastify';

interface IUserDetails {
  username: string;
  password: string;
}

interface IUser {
  fullname: string;
  role: string;
  id: number;
  username: string;
}


export default function Home() {
  const router = useRouter()
  const [userdetails, setUserDetails] = useState<IUserDetails>({
    username: "",
    password: ""
  })

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [error, setError] = useState<string>("")

  const [user, setUser] = useState<IUser>({
    fullname: "",
    role: "user",
    id: 0,
    username: ""
  })

  // const notify = (msg: any) => {
  //   toast.success(msg);
  // }


  const handleLogIn = async (e: any) => {
    e.preventDefault();
    try {
      const response= await axios.post(`${apiUrl}/api/user/loginuser`, userdetails)

      if (response?.data?.success) {
        await 
        localStorage.setItem("token", response?.data?.token)

        if (response?.data?.token) {
          const decoded: IUser = await jwtDecode(response?.data?.token)
          if (response?.data?.message) {
            //setAlertMessage({ isShowAlert: true, message: data.message })
            // notify()
            toast.success(response?.data?.message, {position: "bottom-right", autoClose: 800 })
            // window.alert(data.message)
            // notify(data.message)
          }
          setUser(decoded)
          if (decoded.role === "admin" || decoded.role === "manager") {
            return router.push("/taskapp/dashboard")
          }

          if (decoded.role === "reports") {
            return router.push("/taskapp/reports")
          }

          return router.push("/taskapp/tasks")
        }
      }

    } catch (error: any) {
      console.log("Error", error)
      setError(error.response.data.message)
      //setError(error)
    }
  }
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="mt-4 flex flex-col w-96 border border-blue-200 p-4 rounded bg-white">
        <h4 className="font-bold  text-center mb-4">Task Management System</h4>
        {/* <h6 className="font-bold text-l text-center mb-4">( RNT ) </h6> */}
        <hr />
        <div className="mt-4 flex flex-row justify-center">
          <Image src={AdroitLogo} alt="Adroid Logo " width="150" height="150" />

        </div>
        <form>
          <div className="mt-4">
            <Input variant="faded" size={'sm'} type="Username" label="Enter Username"
              onChange={(e) => {setUserDetails({ ...userdetails, username: e.target.value }) , setError("")} } />
          </div>
          <div className="mt-4">
            <Input size={'sm'}
              variant="faded"
              type={isVisible ? "text" : "password"}
              label="Enter Password"
              onChange={(e) => {setUserDetails({ ...userdetails, password: e.target.value }), setError("")}}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoEye className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              } />
          </div>
          {error && userdetails.username && userdetails.password && <div className="flex flex-row text-red-500 p-2">{error}</div>}
          <div className=" flex flex-row justify-center mt-4" >
            <Button onClick={(e) => handleLogIn(e)} type="submit" className="bg-sky-600 text-white rounded">
              Login
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}

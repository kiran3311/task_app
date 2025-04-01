'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { axiosinstance } from '@/app/libs/axiosinstance';
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { Input } from "@nextui-org/react";


interface IUser {
    fullname?: string;
    username?: string;
    password?: string;
    role?: string
}

interface IChangePasswordUser {
    oldpassword?: string;
    newpassword?: string;
    confirmpassword?: string
}

function ChangePasswordPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("")
    const [userdetails, setUserDetails] = useState<IChangePasswordUser>({
        oldpassword: "",
        newpassword: "",
        confirmpassword: "",
    })

    const [isVisible, setIsVisible] = React.useState(false);
    const [isVisibleNewPass, setIsVisibleNewPass] = React.useState(false);
    const [isVisibleConfirmPass, setIsVisibleConfirmPass] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibilityNewPass = () => setIsVisibleNewPass(!isVisibleNewPass);
  const toggleVisibilityConfirmPass = () => setIsVisibleConfirmPass(!isVisibleConfirmPass);




    const handleChangePassword = async () => {
        try {
            setError("")
            if (!userdetails?.oldpassword?.length) {
                setError("Please enter old password.")
                return;
            }

            if (!userdetails?.newpassword?.length) {
                setError("Please enter new password.")
                return;
            }
            if (!userdetails?.confirmpassword?.length) {
                setError("Please enter confirmed password.")
                return;
            }
           

            if (userdetails.newpassword !== userdetails.confirmpassword) {
                setError("Password and Confirm password does not match.")
                return;
            }

            if(userdetails?.confirmpassword?.length < 6){
                setError("Please enter minimum six charector.")
                return;
            }
            const endpoint = `${apiUrl}/api/user/changepassword`

            const { data } = await axiosinstance.put(endpoint, userdetails)

            if (data.success) {
                await localStorage.removeItem("token")
                window.alert(data.message)
                return router.push("/login")
            }

        } catch (err: any) {
            setError(err.response.data.message)
            console.log("Error in handleChangePassword api", err)
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-col w-full mt-5 ml-3'>
                <div className='flex flex-row mt-4'>
                    <Breadcrumbs classNames={{
                        list: "bg-slate-600",
                    }}
                        itemClasses={{
                            item: "text-white",
                            separator: "text-white",
                        }} variant='solid'>
                        {/* <BreadcrumbItem onClick={() => router.push("/taskapp/users")}>Users</BreadcrumbItem> */}
                        <BreadcrumbItem onClick={() => router.push("/taskapp/users/changepassword")} >Change Password</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <h2 className='font-bold text-xl my-8'>Update Password :</h2>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Enter Old Passworld: </label>
                    <Input value={userdetails.oldpassword} 
                    type={isVisible ? "text" : "password"}
                    placeholder='Enter Old Password' 
                    variant= 'faded'
                    className='mt-1  px-2 py-1' 
                    onChange={(e) => setUserDetails({ ...userdetails, oldpassword: e.target.value })}
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                          {isVisible ? (
                            <IoEyeOff className="text-2xl text-default-400 pointer-events-none " />
                          ) : (
                            <IoEye className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      } />
                </div>
                <div className='flex flex-col mt-4 '>
                    <label className='font-bold'>New Password: </label>
                    <Input value={userdetails.newpassword} 
                    type={isVisibleNewPass ? "text" : "password"}
                      placeholder='Enter New Password' 
                      variant= 'faded'
                     className='mt-1  px-2 py-2' 
                     onChange={(e) => setUserDetails({ ...userdetails, newpassword: e.target.value })}
                     endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibilityNewPass}>
                          {isVisibleNewPass ? (
                            <IoEyeOff className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                          ) : (
                            <IoEye className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      } />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Confirm Password: </label>
                    <Input 
                     type={isVisibleConfirmPass ? "text" : "password"} 
                     variant= 'faded'
                    placeholder='Confirm password' 
                    className='mt-1  px-2 py-1' 
                    onChange={(e) => setUserDetails({ ...userdetails, confirmpassword: e.target.value })} 
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibilityConfirmPass}>
                          {isVisibleConfirmPass ? (
                            <IoEyeOff className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                          ) : (
                            <IoEye className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }/>
                </div>
                {error && <div className="flex flex-row text-red-500 p-2">{error}</div>}
                <div className='mt-4'>
                    <button onClick={() => handleChangePassword()} className='bg-sky-600 text-white px-3 py-1 rounded'>Update Password</button>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordPage
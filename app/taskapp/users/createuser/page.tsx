'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { axiosinstance } from '@/app/libs/axiosinstance';
interface IUser {
    fullname: string;
    username: string;
    password: string;
    role: string
}

function CreateUserPage() {
    const router = useRouter();
    const [userdetails, setUserDetails] = useState<IUser>({
        fullname: "",
        username: "",
        password: "",
        role: "user"
    })

    const handleRadioChange = (event: any) => {
        setUserDetails({ ...userdetails, role: event.target.value });
    };

    const handleCreateUser = async () => {
        try {

            const endpoint = `${apiUrl}/api/user/createuser`

            const { data } = await axiosinstance.post(endpoint, userdetails)

            if (data.success) {
                window.alert(data.message)
                return router.push("/taskapp/users")
            }

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-col w-full mt-5 ml-3'>
                <div className='flex flex-row mt-4'>
                    <Breadcrumbs
                     classNames={{
                        list: "bg-slate-600",
                    }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                        <BreadcrumbItem onClick={() => router.push("/taskapp/users")}>Users</BreadcrumbItem>
                        <BreadcrumbItem onClick={() => router.push("/taskapp/users/createuser")} >Create User</BreadcrumbItem>
                    </Breadcrumbs>
                </div>
                <h2 className='font-bold text-xl mt-4'>Create User</h2>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Full Name: </label>
                    <input type="text" placeholder='Enter Fullname' value={userdetails.fullname} className='mt-1 border border-slate-300 px-2 py-1' onChange={(e) => setUserDetails({ ...userdetails, fullname: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Username: </label>
                    <input type="text" placeholder='Enter username' className='mt-1 border border-slate-300 px-2 py-1' onChange={(e) => setUserDetails({ ...userdetails, username: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Password: </label>
                    <input type="text" placeholder='Enter password' className='mt-1 border border-slate-300 px-2 py-1' onChange={(e) => setUserDetails({ ...userdetails, password: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Access Type : </label>
                    <div className='flex flex-row gap-3'>
                        <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                            <input id='admintype' type="radio" className=' border border-slate-300 px-2 py-1' name='accesstype' value="admin" checked={userdetails.role === "admin"}
                                onChange={handleRadioChange} />
                            <label htmlFor="admintype">Admin</label>
                        </div>
                        <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                            <input id='managertype' type="radio" className=' border border-slate-300 px-2 py-1' name='accesstype' value="manager" checked={userdetails.role === "manager"}
                                onChange={handleRadioChange} />
                            <label htmlFor="managertype">Manager</label>
                        </div>
                        <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                            <input id='usertype' type="radio" className=' border border-slate-300 px-2 py-1' name='accesstype' value="user" checked={userdetails.role === "user"}
                                onChange={handleRadioChange} />
                            <label htmlFor="usertype">User</label>
                        </div>
                        <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                            <input id='supporttype' type="radio" className=' border border-slate-300 px-2 py-1' name='accesstype' value="support" checked={userdetails.role === "support"}
                                onChange={handleRadioChange} />
                            <label htmlFor="supporttype">Support</label>
                        </div>

                        <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                            <input id='reporttype' type="radio" className=' border border-slate-300 px-2 py-1' name='accesstype' value="reports" checked={userdetails.role === "reports"}
                                onChange={handleRadioChange} />
                            <label htmlFor="reporttype">Reports</label>
                        </div>
                    </div>
                </div>
                <div className='mt-2'>
                    <button onClick={() => handleCreateUser()} className='bg-sky-600 text-white px-3 py-1 rounded'>Create User</button>
                </div>
            </div>
        </div>
    )
}

export default CreateUserPage
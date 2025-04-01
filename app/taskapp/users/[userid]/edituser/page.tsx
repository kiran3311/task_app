'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import {
    Input,
    Button,
    Table,

    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import { axiosinstance } from '@/app/libs/axiosinstance';

interface IUser {
    id: number;
    fullname: string;
    username: string;
    role: string;
}

function EditUser({ params }: { params: { userid: number } }) {
    const router = useRouter();
    const [userdetails, setUserDetails] = useState<IUser>({
        id: 0,
        fullname: "",
        username: "",
        role: "",
    })

    useEffect(() => {
        async function getUsers() {
            const { data } = await axiosinstance.get(`${apiUrl}/api/user/getuserbyid/${params.userid}`)
            setUserDetails(data.data)
        }
        getUsers()
    }, [params.userid])

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserDetails({ ...userdetails, role: event.target.value });
    };

    const handleUpdateUser = async () => {
        try {
            console.log("HELLLO => ", userdetails)

            const endpoint = `${apiUrl}/api/user/edituser/${params.userid}`

            const { data } = await axiosinstance.put(endpoint, userdetails)

            if (data.success) {
                window.alert(data.message)
                return router.push("/taskapp/users")
            }

        } catch (err) {
            console.log(err)
        }
    }


    return (
        <>
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
                            <BreadcrumbItem onClick={() => router.push("/taskapp/users/edit")}>Edit Users</BreadcrumbItem>

                        </Breadcrumbs>
                    </div>
                    <h2 className='font-bold text-xl mt-4'>Create User</h2>
                    <div className='flex flex-col mt-4'>
                        <label className='font-bold'>Full Name: </label>
                        <input type="text" placeholder='Enter Fullname' value={userdetails.fullname} className='mt-1 border border-slate-300 px-2 py-1' onChange={(e) => setUserDetails({ ...userdetails, fullname: e.target.value })} />
                    </div>
                    <div className='flex flex-col mt-4'>
                        <label className='font-bold'>Username: </label>
                        <input type="text" placeholder='Enter username' value={userdetails.username} className='mt-1 border border-slate-300 px-2 py-1' onChange={(e) => setUserDetails({ ...userdetails, username: e.target.value })} />
                    </div>

                    <div className='flex flex-col mt-4'>
                        <label className='font-bold'>Access Type : </label>
                        <div className='flex flex-row gap-3'>
                            <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                                <input id='admintype' type="radio" value="admin" className=' border border-slate-300 px-2 py-1' name='accesstype' checked={userdetails.role === "admin"}
                                    onChange={handleRadioChange} />
                                <label htmlFor="admintype">Admin</label>
                            </div>
                            <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                                <input id='managertype' type="radio" value="manager" className=' border border-slate-300 px-2 py-1' name='accesstype' checked={userdetails.role === "manager"}
                                    onChange={handleRadioChange} />
                                <label htmlFor="managertype">Manager</label>
                            </div>
                            <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                                <input id='usertype' type="radio" value="user" className=' border border-slate-300 px-2 py-1' name='accesstype' checked={userdetails.role === "user"}
                                    onChange={handleRadioChange} />
                                <label htmlFor="usertype">User</label>
                            </div>
                            <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                                <input id='supporttype' type="radio" value="support" className=' border border-slate-300 px-2 py-1' name='accesstype' checked={userdetails.role === "support"}
                                    onChange={handleRadioChange} />
                                <label htmlFor="supporttype">Support</label>
                            </div>

                            <div className='flex flex-row items-center mt-1 gap-2 cursor-pointer p-1'>
                                <input id='reporttype' type="radio" value="reports" className=' border border-slate-300 px-2 py-1' name='accesstype' checked={userdetails.role === "reports"}
                                    onChange={handleRadioChange} />
                                <label htmlFor="reporttype">Reports</label>
                            </div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <button onClick={() => handleUpdateUser()} className='bg-sky-600 text-white px-3 py-1 rounded'>Update User</button>
                    </div>
                </div>
            </div>


        </>

    )
}



export default EditUser
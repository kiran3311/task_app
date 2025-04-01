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



function ViewUserPage({ params }: { params: { userid: number } }) {
    const [user, setUser] = useState<IUser>({
        id: 0,
        fullname: "",
        username: "",
        role: "",

    })

    const router = useRouter();
    useEffect(() => {
        async function getUsers() {
            const { data } = await axiosinstance.get(`${apiUrl}/api/user/getuserbyid/${params.userid}`)
            setUser(data.data)

        }
        getUsers()
    }, [params.userid])
    return (
        <div className='flex flex-col mt-4 w-full'>

            <Breadcrumbs classNames={{
                list: "bg-slate-600",
            }}
                itemClasses={{
                    item: "text-white",
                    separator: "text-white",
                }} variant='solid'>
                <BreadcrumbItem onClick={() => router.push("/taskapp/users")}>Users</BreadcrumbItem>
                <BreadcrumbItem onClick={() => router.push(`/taskapp/users/${user.id}`)}>{user.username}</BreadcrumbItem>
            </Breadcrumbs>
            <div className='flex flex-col mt-4 border border-slate-500 bg-white p-4 rounded'>
                <p className='font-bold text-xl underline'>User  Information:</p>
                <div>
                    <div className='flex flex-row mt-6 gap-4 items-center'>
                        <p className='font-bold'>Full Name: </p>
                        <p >{user.fullname}</p>
                    </div>
                    <div className='flex flex-row mt-4 gap-4 items-center'>
                        <p className='font-bold'>Username: </p>
                        <p >{user.username}</p>
                    </div>
                    <div className='flex flex-row mt-4 gap-4 items-center'>
                        <p className='font-bold'>Role: </p>
                        <p >{user.role}</p>
                    </div>
                </div>
            </div>


        </div>
    )

}

export default ViewUserPage
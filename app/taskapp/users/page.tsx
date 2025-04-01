'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { axiosinstance } from '../../libs/axiosinstance';
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
import { useRouter } from 'next/navigation';
interface IUser {
    id: number;
    username: string;
    role: string;
    fullname: string;
}

function UsersPage() {
    const router = useRouter();
    const [usersList, setUsersList] = useState<IUser[]>([])


    useEffect(() => {
        async function getAllUsers() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/user/getallusers`)
                if (data.success) {
                    setUsersList(data.data)
                    console.log("Data =>", data)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllUsers();
    }, [])
    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row  justify-between  w-full mt-5'>
                <Breadcrumbs   classNames={{
                   list: "bg-slate-600",
               }}
               itemClasses={{
                   item: "text-white",
                   separator: "text-white",
               }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/users")}>Users</BreadcrumbItem>
                </Breadcrumbs>
                <button onClick={() => router.push("/taskapp/users/createuser")} className='bg-sky-600 text-white px-3 py-1 rounded'>Create User</button>
            </div>
            <div className='flex flex-row justify-center mt-4'>

                <Table aria-label="Example collection table">
                    <TableHeader>
                        <TableColumn>Sr No.</TableColumn>
                        <TableColumn>Full Name</TableColumn>
                        <TableColumn>Username</TableColumn>
                        <TableColumn>Role</TableColumn>
                        <TableColumn >Action</TableColumn>
                        {/* <TableColumn>Actions</TableColumn> */}
                    </TableHeader>
                    <TableBody>
                        {usersList.map((user, index) => {
                            return (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.fullname}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <>
                                            <button onClick={() => router.push(`/taskapp/users/${user.id}`)} className='bg-orange-400 text-white px-3 py-1 rounded mr-2'>View </button>
                                            <button onClick={() => router.push(`/taskapp/users/${user.id}/edituser/`)} className='bg-orange-400 text-white px-3 py-1 rounded '>Edit</button>
                                        </>
                                    </TableCell>
                                    {/* <TableCell>View</TableCell> */}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default UsersPage
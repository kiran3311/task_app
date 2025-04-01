'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
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
interface IClient {
    id: number;
    clientcode: string;
    clientname: string;
    clientdetails: string;
}

interface IUser {
    id?: number;
    fullname?: number;
}

interface IUserMapping {
    id: number;
    productid: number;
    productname: string,
    managerid: number,
    managerfullname: string
    users: IUser[];
}


interface IProduct {
    id: number;
    productcode: string;
    productname: string;
}


import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { axiosinstance } from '@/app/libs/axiosinstance';
function ManagerTeamMappingPage({ params }: { params: { managerid: number, productid: number } }) {
    const router = useRouter();
    const { managerid, productid } = params
    const [userMapping, setUserMapping] = useState<IUserMapping>({
        id: 0,
        managerfullname: "",
        managerid: 0,
        productid: 0,
        productname: "",
        users: []
    })

    useEffect(() => {
        async function getusermapping() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/managerusermapping/getusermapping/${managerid}/${productid}`)
                if (data.success) {
                    setUserMapping(data.data)
                }
            } catch (err) {
                console.log("Error in getusermapping API", err)
            }
        }
        getusermapping();
    }, [managerid, productid])
    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between w-full mt-5'>
                <Breadcrumbs  classNames={{
                   list: "bg-slate-600",
               }}
               itemClasses={{
                   item: "text-white",
                   separator: "text-white",
               }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/managerteammapping")}>Team Mapping</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push(`/taskapp/managerteammapping/${params.managerid}/${params.productid}`)}>{userMapping.managerfullname}</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='mt-4  flex flex-col  bg-white p-4 rounded border border-slate-500'>
                <p className='font-bold text-xl underline'>Team Info:</p>
                <div className='flex flex-row gap-4 mt-6'>
                    <p className='font-bold'>Product Name:</p>
                    <p>{userMapping.productname}</p>
                </div>
                <div className='flex flex-row mt-4 gap-4'>
                    <p className='font-bold'>Manager Name:</p>
                    <p>{userMapping.managerfullname}</p>
                </div>
                <div className='flex flex-col mt-4'>
                    <p className='font-bold'>Team Members: </p>
                    <div className='flex flex-row flex-wrap mt-2'>
                        {userMapping.users.map(user => {
                            return (
                                <div className='mr-2 mt-2 px-3 text-sm py-1 border border-slate-400 bg-slate-50 rounded-full' key={user.id}>
                                    {user.fullname}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerTeamMappingPage
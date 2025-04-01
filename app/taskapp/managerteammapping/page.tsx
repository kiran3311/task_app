'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { axiosinstance } from '../../libs/axiosinstance';
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

interface IManagerUserMapping {
    id: number
    manager: IUser,
    product: IProduct
}


interface IProduct {
    id: number;
    productcode: string;
    productname: string;
}


import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
function ManagerTeamMappingPage() {
    const router = useRouter();
    const [manageruserMapping, setManageruserMapping] = useState<IManagerUserMapping[]>([])

    useEffect(() => {
        async function getmanagerusermapping() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/managerusermapping/getteammanagermapping`)
                if (data.success) {
                    setManageruserMapping(data.data)
                }
            } catch (err) {
                console.log("Error in getmanagerusermapping API", err)
            }
        }
        getmanagerusermapping();
    }, [])
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
                </Breadcrumbs>
                <button onClick={() => router.push("/taskapp/managerteammapping/createmapping")} className='bg-sky-600 text-white px-3 py-1 rounded'>Create User Mapping</button>
            </div>
            <div className='flex flex-col mt-4'>

                <div className='mt-4'>
                    <Table aria-label="Example collection table">
                        <TableHeader>
                            <TableColumn>Sr No.</TableColumn>
                            <TableColumn>Manager Name</TableColumn>
                            <TableColumn>Product Name</TableColumn>
                            <TableColumn>Action</TableColumn>

                        </TableHeader>
                        <TableBody>
                            {manageruserMapping.map((mapping, index) => {
                                return (
                                    <TableRow key={mapping.id}>

                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{mapping.manager.fullname}</TableCell>
                                        <TableCell>{mapping.product.productname}</TableCell>
                                        <TableCell>
                                            <button onClick={() => router.push(`/taskapp/managerteammapping/${mapping.manager.id}/${mapping.product.id}`)} className='bg-orange-400 text-white px-3 py-1 rounded'>View</button>
                                            {/* <button onClick={() => router.push(`/taskapp/managerteammapping/${mapping.manager.id}/${mapping.product.id}/edit`)} className='bg-red-500 text-white px-3 py-1 rounded ml-3'>Edit</button> */}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default ManagerTeamMappingPage
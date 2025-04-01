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
    clientcode:string;
    clientname: string;
    clientdetails: string;
}
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
function ClientsPage() {
    const router = useRouter();
    const [clientsList, setClientsList] = useState<IClient[]>([])

    useEffect(() => {
        async function getAllClients() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/client/getallclient`)
                if (data.success) {
                    setClientsList(data.data)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllClients();
    }, [])
    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between w-full mt-5'>
            <Breadcrumbs    classNames={{
                   list: "bg-slate-600",
               }}
               itemClasses={{
                   item: "text-white",
                   separator: "text-white",
               }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/clients")}>Clients</BreadcrumbItem>
                </Breadcrumbs>
                <button onClick={() => router.push("/taskapp/clients/createclient")} className='bg-sky-600 text-white px-3 py-1 rounded'>Create Client</button>
            </div>
            <div className='flex flex-col mt-4'>
               
                <div className='mt-4'>
                    <Table aria-label="Example collection table">
                        <TableHeader>
                            <TableColumn>Sr No.</TableColumn>
                            <TableColumn>Client code</TableColumn>
                            <TableColumn>Client Name</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {clientsList.map((client, index) => {
                                return (
                                    <TableRow key={client.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{client.clientcode}</TableCell>
                                        <TableCell>{client.clientname}</TableCell>
                                        <TableCell>
                                        <>
                                            <button onClick={() => router.push(`/taskapp/clients/${client.id}`)} className='bg-orange-400 text-white px-3 py-1 rounded mr-2'>View </button>
                                            {/* <button onClick={() => router.push(`/taskapp/clients/${client.id}/edit`)} className='bg-orange-400 text-white px-3 py-1 rounded'>Edit</button> */}
                                        </>
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

export default ClientsPage
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
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
interface ITaskDescription {
    id: number;
    taskdescription: string;
    tasktype?: string;
}

function TaskDescriptionPage() {
    const router = useRouter();
    const [taskdescriptionList, setTaskdescriptionList] = useState<ITaskDescription[]>([])

    useEffect(() => {
        async function getAllDescription() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/taskdescription/getalltaskdescription`)
                if (data.success) {
                    setTaskdescriptionList(data.data)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllDescription();
    }, [])
    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between w-full mt-5'>
                <Breadcrumbs
                    classNames={{
                        list: "bg-slate-600",
                    }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/taskdescription")}>Task Description</BreadcrumbItem>

                </Breadcrumbs>
                <button onClick={() => router.push("/taskapp/taskdescription/createtaskdescription")} className='bg-sky-600 text-white px-3 py-1 rounded'>Create Task Description</button>
            </div>
            <div className='flex flex-row justify-center mt-4'>
                <Table aria-label="Example collection table">
                    <TableHeader>
                        <TableColumn>Sr No.</TableColumn>
                        <TableColumn>Task Type</TableColumn>
                        <TableColumn>Task Description</TableColumn>
                        <TableColumn>Action</TableColumn>
                        {/* <TableColumn>View</TableColumn> */}
                    </TableHeader>
                    <TableBody>
                        {taskdescriptionList.map((td, index) => {
                            return (
                                <TableRow key={td.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{td.tasktype}</TableCell>
                                    <TableCell>{td.taskdescription}</TableCell>
                                    {/* <TableCell>View</TableCell> */}
                                    <TableCell>
                                        <>
                                            <button onClick={() => router.push(`/taskapp/taskdescription/${td.id}`)} className='bg-orange-400 text-white px-3 py-1 rounded mr-2'>View </button>
                                            <button onClick={() => router.push(`/taskapp/taskdescription/${td.id}/edittaskdescription/`)} className='bg-orange-400 text-white px-3 py-1 rounded '>Edit</button>
                                        </>
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TaskDescriptionPage
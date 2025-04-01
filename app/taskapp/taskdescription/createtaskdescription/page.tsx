'use client'
import { axiosinstance } from '@/app/libs/axiosinstance';
import { apiUrl } from '@/config';
import { Input, Textarea } from '@nextui-org/react';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
interface ITaskDescription {
    id?: number;
    taskdescription?: string;
    tasktype?: string
}

function CreateTaskdescriptionPage() {
    const router = useRouter();
    const [taskdescriptionState, setTaskdescriptionState] = useState<ITaskDescription>({
        taskdescription: "",
        tasktype: "Development"
    })

    const handleCreateTaskdescription = async () => {
        try {
            const endpoint = `${apiUrl}/api/taskdescription/createtaskdescription`
            const { data } = await axiosinstance.post(endpoint, taskdescriptionState)
            if (data.success) {
                window.alert(data.message)
                return router.push("/taskapp/taskdescription")
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-col w-full mt-5 ml-3'>
                <Breadcrumbs
                    classNames={{
                        list: "bg-slate-600",
                    }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/taskdescription")}>Task Description</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/taskdescription/createtaskdescription")} >Create Task Description</BreadcrumbItem>

                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Create Task Description</h2>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Task Type </label>
                    <select value={taskdescriptionState.tasktype} onChange={(e) => setTaskdescriptionState({ ...taskdescriptionState, tasktype: e.target.value })} className='mt-3 border border-slate-400 p-1 rounded outline-none'>
                        {/* <option value="Development">Development</option> */}
                        <option value="Support">Support</option>
                    </select>
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Task Description </label>
                    <Input type="text" className='rounded mt-3' placeholder='Enter Task Description' onChange={(e) => setTaskdescriptionState({ ...taskdescriptionState, taskdescription: e.target.value })} />
                </div>
                <div className='mt-4'>
                    <button onClick={() => handleCreateTaskdescription()} className='bg-sky-600 text-white px-3 py-1 rounded'>Create Task Description</button>
                </div>
            </div>
        </div>
    )
}

export default CreateTaskdescriptionPage
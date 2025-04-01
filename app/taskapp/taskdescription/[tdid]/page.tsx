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

function ViewTaskDescreption({ params }: { params: { tdid: number } }) {

    const router = useRouter();
    const [taskdescriptionState, setTaskdescriptionState] = useState<ITaskDescription>({
        taskdescription: "",
        tasktype: ""
    })

    useEffect(() => {
        async function getTd() {
            const { data } = await axiosinstance.get(`${apiUrl}/api/taskdescription/gettaskdescriptionbyid/${params.tdid}`)
            setTaskdescriptionState(data.data)
        }
        getTd()
    }, [params.tdid])

    return (<>

        <div className='flex flex-col ml-4 mt-4 w-full'>

            <Breadcrumbs
                classNames={{
                    list: "bg-slate-600",
                }}
                itemClasses={{
                    item: "text-white",
                    separator: "text-white",
                }} variant='solid'>
                <BreadcrumbItem onClick={() => router.push("/taskapp/users")}>taskdescription</BreadcrumbItem>
                <BreadcrumbItem onClick={() => router.push(`/taskapp/users/${taskdescriptionState.id}`)}>{taskdescriptionState.tasktype}</BreadcrumbItem>
            </Breadcrumbs>
            <div className='flex flex-col mt-6 border border-slate-500 bg-white p-4 rounded'>
                <p className='font-bold text-xl underline'>Task Description Details:</p>
                <div>
                    <div className='flex flex-row mt-6 gap-4 items-center'>
                        <p className='font-bold'>Task Type: </p>
                        <p >{taskdescriptionState.tasktype}</p>
                    </div>
                    <div className='flex flex-row mt-4 gap-4 items-center'>
                        <p className='font-bold'>Task Description: </p>
                        <p >{taskdescriptionState.taskdescription}</p>
                    </div>

                </div>
            </div>


        </div>


    </>)
}




export default ViewTaskDescreption
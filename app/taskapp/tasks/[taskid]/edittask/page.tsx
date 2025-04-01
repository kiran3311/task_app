'use client'
import React, { useState, useEffect } from 'react'
import {
    Input,
    Textarea
} from "@nextui-org/react";
import { apiUrl } from '@/config';
import TaskComponent from '@/app/components/TaskComponent';
import { axiosinstance } from '@/app/libs/axiosinstance';
import ButtonDropdown from '@/app/components/ButtonDropdown';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import ViewTaskComponent from '@/app/components/ViewTaskComponent';
import EditTaskForDeveloper from '@/app/components/EditTaskForDeveloper';
import { ITask } from '../edit/page';
type Key = string | number;
export type IKeyValue = {
    [K in Key]: string;
};


export interface IMainTaskDetails {
    productid?: number;
    tasktype?: string;
    clientid?: number;
    projectid?: number;
    taskdescriptionid?: number;
}

interface IProject {
    id: number;
    projectname: string;
    projectdescription: string;
}

interface IModule {
    id: number;
    modulename: string;
    moduledescription: string;
    weightage: string;
    project: IProject;
}

interface IProject {
    id: number;
    projectname: string;
}

function SingleTaskEditPage({ params }: { params: { taskid: string } }) {
    const [timeInput, setTimeInput] = useState('');
    const [error, setError] = useState('');

    const handleTimeChange = (e: any) => {
        const value = e.target.value;
        setTask({ ...task, timetocompletetask: value })
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (regex.test(value)) {

            setError('');
        } else {
            setError('Please enter a valid time format (hh:mm)');
        }
    };


    const handleStatusChange = (value: string) => {
        setTask({ ...task, status: value })
    }

    const router = useRouter();
    const [task, setTask] = useState<ITask>({
        id: 0,
        taskname: "",
        priority: "",
        actualstartdate: new Date(),
        duedate: new Date(),
        completiondate: new Date(),
        status: "",
        billingtype: "",
        approvalstatus: "",
        clientname: "",
        projectname: "",
        remarkforinnerhtml: "",
        remarkforeditting: "",
        flag: "",
        assigneeuser: "",
        modulename: "",
        productname: "",
        projectlead: "",
        taskdescriptionname: "",
        tasktype: "",
        teamleaduser: "",
        percentage: 0,
        comments: [],
        timetocompletetask: "",
        assignstartdate: new Date()
    });

    const [percentage, setPercentage] = useState<string>("")

    const handleSubmitPercentage = async () => {
        try {
            const { data } = await axiosinstance.put(`${apiUrl}/api/task/updatetaskpercentage`, {
                percentage: Number(percentage),
                taskid: params.taskid
            })
            return router.push(`/taskapp/tasks/${params.taskid}`)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        async function fetchTask() {
            try {
                const { data } = await axiosinstance.get(`${apiUrl}/api/task/gettaskbyid/${Number(params.taskid)}`)
                if (data.success) {
                    setTask(data.data)
                    setPercentage(data.data.percentage)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchTask();
    }, [params.taskid])

    console.log("TSTATUS => ", task.status)
    return (
        <div className='w-full flex flex-col mb-11'>
            <div className='w-full flex flex-row gap-2 mt-5 '>
                <Breadcrumbs  classNames={{
                   list: "bg-slate-600",
               }}
               itemClasses={{
                   item: "text-white",
                   separator: "text-white",
               }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/tasks")}>Tasks</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/task/createtask")} >{task.taskname}</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='w-full flex flex-row gap-2 mt-4 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Product Name: </label>
                    {task.productname}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Task Type: </label>
                    {task.tasktype}
                </div>


            </div>

            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Client Name: </label>
                    {task.taskname}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Project Name: </label>
                    {task.projectname}
                </div>

            </div>
            <div className='flex flex-col ml-5'>
                <EditTaskForDeveloper error={error} setError={setError} task={task} handleStatusChange={handleStatusChange} timeInput={timeInput} setTimeInput={setTimeInput} handleTimeChange={handleTimeChange} />
            </div>
            <div className=' mt-4 flex flex-row ml-5'>
                <div className='flex flex-col w-full'>
                    <label className=' font-bold '>Percentage: <span className='font-normal text-sm'>(Enter percentage in number ex. 30)</span></label>
                    <div className='flex flex-row gap-2 mt-3'>
                        <Input value={percentage} className="border mr-5" size={'sm'} type="number" label="" onChange={(e) => {
                            setPercentage(e.target.value)
                        }} />
                        <button onClick={handleSubmitPercentage} className='text-sm bg-sky-600 text-white px-2 py-1 rounded basis-[213px] flex justify-center items-center'><span>Update Percentage</span></button>
                    </div>

                </div>

            </div>

        </div>
    )
}


export default SingleTaskEditPage
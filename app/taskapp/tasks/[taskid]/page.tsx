'use client'
import React, { useState, useEffect } from 'react'

import Datetime from 'react-datetime';
import { apiUrl } from '@/config';
import { axiosinstance } from '@/app/libs/axiosinstance';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import ViewTaskComponent from '@/app/components/ViewTaskComponent';
import { ITask } from './edit/page';
import moment, { Moment } from 'moment';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { MdEdit } from "react-icons/md";
import Link from 'next/link'
import { Spinner } from "@nextui-org/react";


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


interface IComment {
    id?: number;
    comment?: string;
    startdate?: string | Date | Moment | undefined;
    enddate?: string | Date | Moment | undefined;
    taskid?: string | Date | Moment | undefined;
    createdAt?: string | Date | Moment | undefined;
}

interface ICommentResult {
    id: number;
    comment: string;
    taskid?: number;
    user?: IUser;
    startdate: Date;
    endDate: Date;
    createdAt: Date;
}


interface IUser {
    fullname: string;
    role: string;
    id: number;
    username: string;
}
function SingleTaskPage({ params }: { params: { taskid: string } }) {

    const [user, setUser] = useState<IUser>({
        fullname: "",
        role: "user",
        id: 0,
        username: ""
    })


    const [commentValidationError, setCommentValidationError] = useState<string>("")
    const [isValidCommentSatrtDate, setIsValidCommentStartDate] = useState<any>(true)
    const [isValidCommentEndDate, setIsValidCommentEndDate] = useState<any>(true)
    const [checkIntervalCount, setCheckIntervalCount] = useState<number>(0)
    const [cuttofTime, setCuttofTime] = useState<boolean>(false)

    useEffect(() => {
        async function jwtDecodeMethod() {
            try {
                const token = await localStorage.getItem('token')
                if (token) {
                    const decoded: any = jwtDecode(token)
                    setUser(decoded)
                }
            } catch (err) {
                console.log(err)
            }
        }
        jwtDecodeMethod()
    }, [])

    const router = useRouter();
    const [task, setTask] = useState<ITask>({
        id: 0,
        taskname: "",
        priority: "",
        actualstartdate: "",
        duedate: "",
        completiondate: "",
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
        comments: [],
        assignstartdate: "",
    });

    const [newComment, setNewComment] = useState<IComment>({
        comment: "",
        startdate: moment(new Date()),
        enddate: moment(new Date()),
        taskid: params.taskid,

    })

    const [isTimeLimit, setIsTimeLismit] = useState<boolean>(false)

    useEffect(() => {
        async function fetchTask() {
            try {
                const { data } = await axiosinstance.get(`${apiUrl}/api/task/gettaskbyid/${Number(params.taskid)}`)
                if (data.success) {
                    setTask(data.data)
                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchTask();
    }, [params.taskid])





    const handleCommentSubmit = async () => {

        if (!isValidCommentSatrtDate || !isValidCommentEndDate) {
            setCommentValidationError("Please Enter Valid Date and time.")
            toast.warn("Please Enter Valid Date and time.", { position: "bottom-right", autoClose: 800 })
            return;
        }
        if (!timeValidate()) {
            setCommentValidationError("Comment Start Time should be less than Comment End Date.")
            toast.warn("Comment Start Time should be less than Comment End Date.", { position: "bottom-right", autoClose: 800 })
            return;
        }

        try {
            setCommentValidationError("")
            if (newComment && newComment.comment && newComment.comment?.trim().length <= 0) {
                toast.warn("Please Enter Comment", { position: "bottom-right", autoClose: 800 })
                return;
            }
            if (newComment && !newComment.comment) {
                toast.warn("Please Enter Comment", { position: "bottom-right", autoClose: 800 })
                return;
            }
            const result = window.confirm('Are you sure you want to update comment?')
            if (result) {
                const endpoint = `${apiUrl}/api/task/createtaskcomment`
                const { data } = await axiosinstance.post(endpoint, newComment)
                setNewComment({
                    comment: "",
                    startdate: moment(new Date()),
                    enddate: moment(new Date()),
                    taskid: params.taskid
                })
                if (data.success) {

                    let newTask = { ...task, comments: [data.data, ...task.comments,] }
                    setTask(newTask)
                    toast.success("New Comment updated", { position: "bottom-right", autoClose: 800 })
                    setCheckIntervalCount(1)
                }

            }


        } catch (err) {
            console.log(err)
        }
    }


    const startDateInvalid = (value: any) => {
        setNewComment({ ...newComment, startdate: value })
        setIsValidCommentStartDate(value && value.isValid && value.isValid())
    }

    const endDateInvalid = (value: any) => {
        setNewComment({ ...newComment, enddate: value })
        setIsValidCommentEndDate(value && value.isValid && value.isValid())
    }



    const timeValidate = () => {

        let startTime = moment(newComment.startdate).format('HH:mm:ss')
        let endTime = moment(newComment.enddate).format('HH:mm:ss')
        const startDate = moment(newComment.startdate).format('YYYY-MM-DD');
        const endDate = moment(newComment.enddate).format('YYYY-MM-DD');


        if ((startTime >= endTime) && (startDate >= endDate)) {
            return false
        }

        return true
    }




    let currTime = new Date()
    let commTime = task?.comments[0]?.createdAt

    let aDate = moment(currTime).format('YYYY-MM-DD')
    let bDate = moment(commTime).format('YYYY-MM-DD')
    let aTime = moment(currTime).format('HH:mm:ss')
    let bTime = moment(commTime).format('HH:mm:ss')


    let momentA = moment(aTime, 'HH:mm:ss');
    let momentB = moment(bTime, 'HH:mm:ss');

    // Calculate the difference in milliseconds
    let differenceInMilliseconds = momentA.diff(momentB);

    // Convert the difference to a human-readable format
    let duration = moment.duration(differenceInMilliseconds);

    // Output the difference in hours, minutes, and seconds
    let hours = Math.floor(duration.asHours());
    let minutes = Math.floor(duration.asMinutes()) - hours * 60;
    let seconds = Math.floor(duration.asSeconds()) - hours * 3600 - minutes * 60;



    useEffect(() => {
        if ((aDate === bDate) && (task.status !== "Close") && (user.role === "user")) {
            setIsTimeLismit(true)
        }
        else {
            setIsTimeLismit(false)
        }

    }, [task.comments])


    useEffect(() => {
        const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
        const timer = setTimeout(() => {
            // Change state value after 24 hours
            setIsTimeLismit(false)
        }, twentyFourHoursInMilliseconds);

        // Clean up function to clear the timer if component unmounts or state changes before 24 hours
        return () => clearTimeout(timer);
    }, []);



    const isValidStartDate = (current: any) => {
        let currentdate = moment()
        return current ? current.isSameOrBefore(currentdate.startOf('day')) : false;
    }


    const isValidEndDate = (current: any) => {
        let startTime = moment(newComment.startdate).format('HH:mm:ss')
        let endTime = moment(newComment.enddate).format('HH:mm:ss')
        return newComment.startdate ? current.isSameOrAfter(moment(newComment.startdate).startOf('day')) : false;
    };
    console.log("taske--------comments>>>", task)


    // useEffect(() => {
    //     console.log("task--------comments>>>", task)
    //     const date = task.comments.map((cmt) => {
    //         return new Date(cmt.createdAt);
    //     })
    //     const currentDate = new Date()
    //    const iswithindate =  date.some((date) => {
    //         // const diffInMs = Number(currentDate) - Number(date);
    //         const diffInMs = currentDate.getTime() - date.getTime();
    //       //  console.log("Diff", currentDate, date)
    //         // Convert milliseconds to days
    //         const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    //         console.log(`Difference in days: ${diffInDays.toFixed(2)}`);

    //         // Update state if the date is passed by more than 2 days
    //         // if (diffInDays > 2) {
    //         //     setCuttofTime(false);
    //         // } else {
    //         //     setCuttofTime(true);
    //         // }

    //         return diffInDays > 2
    //     })

    //     setCuttofTime(iswithindate)
    

    // }, [task.comments])


    const editIconShow = (created:any, id:any, taskid:any)=>{
        console.log("task--------comments>>>", task)
       
            const dt = new Date(created)
            const currentDate = new Date()
            
                 // const diffInMs = Number(currentDate) - Number(date);
                 const diffInMs = currentDate.getTime() - dt.getTime();
                // console.log("Diff", currentDate, date)
                 // Convert milliseconds to days
                 const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
     
                 console.log(`Difference in days: ${diffInDays.toFixed(2)}`);
     
               
     
                 
     
                 if(diffInDays > 2){
                     return(<></>) 
                 }
                 else { 
                     return(<Link href={`/taskapp/tasks/${taskid}/editcomment/${id}`} className='px-2  inline-flex text-center' >
                        <span><MdEdit className='text-blue-800 text-xl' /></span>
                    </Link>)
                 }
    }

    return (
        <div className='w-full flex flex-col  mb-48'>


            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <Breadcrumbs classNames={{
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


            <div className='w-full flex flex-row gap-2 mt-4 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Product Name: </label>
                    {task.productname}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Client Name: </label>
                    {task.clientname}
                </div>
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 '>

                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Project Name: </label>
                    {task.projectname}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Billing Type: </label>
                    {task.billingtype}
                </div>
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Task Type: </label>
                    {task.tasktype}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Task Description : </label>
                    {task.taskdescriptionname}
                </div>

            </div>

            <div className='flex flex-col'>
                <ViewTaskComponent user={user} task={task} setTask={setTask} />
            </div>

            {/* <div className='flex flex-row  mt-3 mb-3 gap-2'>
                <span className='font-bold'>Percentage : </span>
                <span>{task.percentage}</span>
            </div> */}
            <hr />
            <div className='flex flex-col mt-3 mb-5'>
                <div className='font-bold'>Comments</div>

                <hr />
                {user.id === task.assigneeuserid && task.status !== "Close" && task.actualstartdate && (
                    <div className='w-full flex flex-col gap-2 mt-5 shadow border border-slate-400 rounded p-4 bg-white'>
                        <div className='flex flex-row gap-3'>
                            <div className='flex flex-col'>
                                <label className='font-bold'>Start Date: </label>
                                <Datetime isValidDate={isValidStartDate} closeOnSelect onChange={startDateInvalid} className='border border-slate-300 p-1' value={moment(newComment.startdate)} />
                            </div>
                            {/* moment(newComment.startdate).isValid() ? newComment.startdate : "" */}
                            <div className='flex flex-col'>
                                <label className='font-bold'>End Date: </label>
                                <Datetime isValidDate={isValidEndDate} closeOnSelect onChange={endDateInvalid} className='border border-slate-300 p-1' value={moment(newComment.enddate)} />
                            </div>
                        </div>
                        <div className='mt-4'>
                            {commentValidationError && commentValidationError.length > 0 && (
                                <p className='text-red-500'>{commentValidationError}</p>
                            )}
                        </div>
                        <div className='flex flex-col items-start w-full mt-4'>
                            <textarea value={newComment.comment} className="border border-slate-500 rounded outline-none p-2 w-full" placeholder="Enter Comments" onChange={(e) => {
                                setNewComment({ ...newComment, comment: e.target.value })
                            }} />
                            <div className='flex flex-col items-start w-full mt-5'>
                                <Button onClick={handleCommentSubmit} className='bg-sky-600 text-white px-3 py-1 rounded font-semibold'>Add Comment</Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className='flex flex-col mb-11 w-full'>
                    {task?.comments.map((cmt, i) => {

                        return (
                            <div key={cmt.id} className='mt-2 bg-white border shadow border-slate-300 p-3 rounded w-full'>
                                <div>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-xs mt-2 font-bold mb-2'>{cmt.user?.fullname}</p>

                                        {/* {(isTimeLimit === true) && (i === 0) && (
                                            <Link href={`/taskapp/tasks/${task.id}/editcomment/${cmt.id}`} className='px-2  inline-flex text-center' >
                                                <span><MdEdit className='text-blue-800 text-xl' /></span>
                                            </Link>
                                        )} */}

                                        {(task.status == "In Progress") && (
                                            <Link href={`/taskapp/tasks/${task.id}/editcomment/${cmt.id}`} className='px-2  inline-flex text-center' >
                                                <span><MdEdit className='text-blue-800 text-xl' /></span>
                                            </Link>
                                        )}

                                        {/* <Link href={`/taskapp/tasks/${task.id}/editcomment/${cmt.id}`} className='px-2  inline-flex text-center' >
                                            <span><MdEdit className='text-blue-800 text-xl' /></span>
                                        </Link>  */}
                                          {/* {editIconShow(cmt.createdAt, cmt.id, task.id)} */}
                                               
                                    </div>
                                    <hr />
                                    <p className='mt-2 mb-2'>{cmt.comment}</p>
                                    <hr />
                                    <div className='mt-2'>
                                        <p className='flex flex-row text-xs'><span className='font-bold mr-2'>Start Date :</span> <span>{moment(cmt.startdate).format('DD/MMM/YYYY hh:mm a')}</span></p>
                                        <p className='flex flex-row text-xs'><span className='font-bold mr-2'>End Date :</span> <span>{moment(cmt.enddate).format('DD/MMM/YYYY hh:mm a')}</span></p>
                                        <p className='flex flex-row text-xs mt-2 text-slate-500'><span>{moment(cmt.createdAt).fromNow()}</span></p>

                                    </div>
                                </div>
                            </div>
                        )


                    })}
                </div>
            </div>
        </div>
    )
}


export default SingleTaskPage
'use client'
import React, { useState, useEffect } from 'react'

import Datetime from 'react-datetime';
import { apiUrl } from '@/config';
import { axiosinstance } from '@/app/libs/axiosinstance';
import { useRouter } from 'next/navigation';
import { NextRouter } from 'next/router';
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import ViewTaskComponent from '@/app/components/ViewTaskComponent';
import { ITask } from '../../edit/page';
import moment, { Moment } from 'moment';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';
import { MdEdit } from "react-icons/md";
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



function SingleTaskEditCommentPage({ params }: { params: { taskid: string, commentid: string } }) {

    const [isValidCommentSatrtDate, setIsValidCommentStartDate] = useState<any>(true)
    const [isValidCommentEndDate, setIsValidCommentEndDate] = useState<any>(true)



    const [user, setUser] = useState<IUser>({
        fullname: "",
        role: "user",
        id: 0,
        username: ""
    })


    const [commentValidationError, setCommentValidationError] = useState<string>("")

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



    const [isTimeLimit, setIsTimeLismit] = useState(false)

    const [commentdata, setCommentData] = useState<any>({})
    const [newComment, setNewComment] = useState<IComment>({
        comment: "",
        startdate: moment(new Date()),
        enddate: moment(new Date()),
        taskid: params.taskid,

    })

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


    useEffect(() => {
        async function getComment() {
            try {
                const { data } = await axiosinstance.get(`${apiUrl}/api/task/getcommentbyid/${Number(params.commentid)}`)
                console.log(data.data)
                if (data.success) {
                    setCommentData(data.data)
                    setNewComment({
                        comment: data.data.comment,
                        startdate: moment(data.data.startDate),
                        enddate: moment(data.data.endDate),
                        taskid: params.taskid
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
        getComment()
    }, [params.commentid])







    const handleCommentUpdate = async () => {
        if (!isValidCommentSatrtDate || !isValidCommentEndDate) {
            setCommentValidationError("Please Enter Valid Date and time.")
           
            toast.warn("Please Enter Valid Date and time.", {position: "bottom-right" , autoClose:800})
            return;
        }
        if (!isTimeLimit) {
            window.alert("Time expired")
            router.push(`/taskapp/tasks/${params.taskid}`)
            return false
        }

        if (!timeValidate()) {
            setCommentValidationError("Comment Start Time should be less than Comment End Date.")
            toast.warn("Comment Start Time should be less than Comment End Date.", {position: "bottom-right" , autoClose:800})
            return;
        }

        try {
            setCommentValidationError("")
            if (newComment && newComment.comment && newComment.comment?.trim().length <= 0) {
                return;
            }
            if (newComment && !newComment.comment) {
                return;
            }
            const result = window.confirm('Are you sure you want to update comment?')
            if (result) {
                const endpoint = `${apiUrl}/api/task/updatecommentbycommentid/${Number(params.commentid)}`
                const { data } = await axiosinstance.put(endpoint, newComment)
                setNewComment({
                    comment: "",
                    startdate: moment(new Date()),
                    enddate: moment(new Date()),
                    taskid: params.taskid
                })
                if (data.success) {

                    let newTask = { ...task, comments: [data.data, ...task.comments,] }
                    setTask(newTask)
                    toast.success("New Comment updated", {position: "bottom-right", autoClose: 800 })
                    return router.push(`/taskapp/tasks/${params.taskid}`)
                }

            }


        } catch (err) {
            console.log(err)
        }
    }

    // const isValidDate = (current: any) => {
    //     const currentDate = current.startOf('day');
    //     const minDate = moment('2021-01-01').startOf('day');
    //     const maxDate = moment('2030-01-01').startOf('day');

    //     return currentDate.isSameOrAfter(minDate) && currentDate.isSameOrBefore(maxDate);
    // };

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


    // console.log(" adate---->", aDate, " bdate---->", bDate)
    // console.log(" aTime---->", aTime, " aTime---->", bTime)
    // console.log(`Time difference: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);

    const startDateInvalid = (value: any) => {
        setNewComment({ ...newComment, startdate: value })
        setIsValidCommentStartDate(value && value.isValid && value.isValid())
    }

    const endDateInvalid = (value: any) => {
        setNewComment({ ...newComment, enddate: value })
        setIsValidCommentEndDate(value && value.isValid && value.isValid())
    }


    useEffect(() => {
        if ((aDate === bDate) ) {
            setIsTimeLismit(true)
        }
        else { setIsTimeLismit(false) }


    }, [currTime])

    const isValidStartDate = (current: any) => {
        let currentdate = moment()
        return current ? current.isSameOrBefore(currentdate.startOf('day')) : false;
    }

    const isValidEndDate = (current: any) => {
        //return newComment.startdate ? current.isAfter(newComment.startdate) : false;
        // if(startTime > endTime){ return false

        let startTime = moment(newComment.startdate).format('HH:mm:ss')
        let endTime = moment(newComment.enddate).format('HH:mm:ss')

        return newComment.startdate ? current.isSameOrAfter(moment(newComment.startdate).startOf('day')) : false;
    };
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
                {/* user.id === task.assigneeuserid && task.status !== "Close" && task.actualstartdate && */}
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
                                <Button onClick={handleCommentUpdate} className='bg-sky-600 text-white px-3 py-1 rounded font-semibold'>Update Comment</Button>
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


export default SingleTaskEditCommentPage
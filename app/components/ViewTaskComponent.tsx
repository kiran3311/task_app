'use client'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { ITask } from '../taskapp/tasks/[taskid]/edit/page';
import { axiosinstance } from '../libs/axiosinstance';
import { apiUrl } from '@/config';
import { Slider } from "@nextui-org/react";
import {Button} from "@nextui-org/react";


interface IUser {
    fullname: string;
    role: string;
    id: number;
    username: string;
}

var formats = [
    "background",
    "bold",
    "color",
    "font",
    "code",
    "italic",
    "link",
    "size",
    "strike",
    "script",
    "underline",
    "blockquote",
    "header",
    "indent",
    "list",
    "align",
    "direction",
    "code-block",
    "formula",
    // 'image'
    // 'video'
];
const modules = {
    toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [
            { align: null },
            { align: "center" },
            { align: "right" },
            { align: "justify" },
        ],
        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        ["clean"],
    ],
};

interface IProject {
    id: number;
    projectname: string;
    projectdescription: string;
}


//task.status === "Close" && task.actualstartdate == null &&
function ViewTaskComponent({ user, task, setTask }: { user: IUser, task: ITask, setTask?: any }) {

    const [sliderValue, setSliderValue] = useState<any>(task.percentage)


    // useEffect(  ()=>{
    //  if(task.status === "Close"){
    //     setSliderValue(100)

    //  }
    //  else if (task.status === "Open"){
    //     setSliderValue(task.percentage)
    //  }

    // },[ task])

    useEffect(() => {
        if (task.completiondate) {
            setSliderValue(100)
        }
    }, [task])

    const handleTaskStatusChange = async () => {
        if (task.status === "Close" && task.comments.length === 0) {
            window.alert(" At least one comment is mandatory to close the status")
            return false
        }
        if (task.status === "Close" && task.actualstartdate === null) {
            window.alert("Actual start date is mandatory to close the status ")
            return false
        }


        try {
            let body = {
                taskid: task.id,
                status: task.status
            }
            const { data } = await axiosinstance.put(`${apiUrl}/api/task/updatetaskstatus`, body)
            if (data.success) {
                if (data.isUpdatedActualStartDate) {

                    setTask((prevstate: any) => ({ ...prevstate, status: data.data.status, actualstartdate: data.data.actualstartdate }))
                }

                if (data.isUpdatedCompletionDate
                ) {
                    setTask({ ...task, completiondate: data.data.completiondate, status: data.data.status, })
                }

                window.alert("Status Updated Successfuly")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleTaskProgressSave = async () => {
        try {

            let body = {
                taskid: task.id,
                percentage: (Number(sliderValue))
            }

            const { data } = await axiosinstance.put(`${apiUrl}/api/task/updateprogresspercentage`, body)
            if (data.success) {
                if (data.actualstartdate) {

                    setTask((prepercentage: any) => ({ ...prepercentage, percentage: (data.data.percentage) }))
                }
                window.alert("Progress Updated Successfuly")
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleSliderChange = (newValue: any) => {
        setSliderValue(newValue);
    };



    return (
        <div className='flex flex-col rounded  mt-4'>
            <div className='w-full flex flex-row gap-2 '>
                {/* <div className='w-full flex flex-row gap-3 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[20%] text-end'>Task Name: </label>
                    <Input value={task.taskname} className="border mr-5" size={'sm'} type="text" label="Enter Task Name" onChange={(e) => {
                        handleUpdateItem(task.id, "taskname", e.target.value)
                    }} />
                </div> */}
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start self-start font-bold basis-[35%] text-start'>Remarks: </label>
                    <div className='flex flex-col w-full h-40 overflow-auto'>
                        <p>{task.remarkforinnerhtml}</p>
                    </div>
                </div>

                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Module Name: </label>
                    {task.modulename}
                </div>
            </div>

            {/* <div className='flex flex-row gap-2 mt-16 ml-5 h-full'>
                <div className='w-full flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end self-start  font-bold basis-[20%] text-end'>Upload  & Download: </label>
                    <div className="  w-full p-2 border rounded">
                        <div className='flex flex-col'>
                            <div className='flex flex-row  items-center justify-evenly'>
                                <div>
                                    <Input className="w-full border" size={'sm'} type="file" />
                                </div>
                                <div>
                                    <Button className='bg-red-500 text-white rounded'>
                                        Upload
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <Table aria-label="Example collection table">
                                <TableHeader>
                                    <TableColumn>Sr no</TableColumn>
                                    <TableColumn>ROLE</TableColumn>
                                    <TableColumn>STATUS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell>1</TableCell>
                                        <TableCell>File Name 1</TableCell>
                                        <TableCell>{new Date().toISOString()}</TableCell>
                                    </TableRow>
                                    <TableRow key="2">
                                        <TableCell>2</TableCell>
                                        <TableCell>File Name 2</TableCell>
                                        <TableCell>{new Date().toISOString()}</TableCell>
                                    </TableRow>
                                    <TableRow key="3">
                                        <TableCell>3</TableCell>
                                        <TableCell>File Name 2</TableCell>
                                        <TableCell>{new Date().toISOString()}</TableCell>
                                    </TableRow>
                                    <TableRow key="4">
                                        <TableCell>4</TableCell>
                                        <TableCell>File Name 4</TableCell>
                                        <TableCell>{new Date().toISOString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className='w-full flex flex-row gap-2 mt-5 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Priority: </label>
                    {task.priority}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Project Lead: </label>
                    {task.projectlead}
                </div>
            </div>

            {/* <div className='w-full flex flex-row gap-2 mt-5 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Team Lead: </label>
                    {task.teamleaduser}
                </div>
            </div> */}

            <div className='w-full flex flex-row gap-2 mt-5 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Assignee: </label>
                    {task.assigneeuser}
                </div>

                {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Flag: </label>
                    {task.flag}
                </div> */}
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Assign Date: </label>
                    {
                        moment(task.assignstartdate).format('DD/MMM/YYYY hh:mm a')
                    }

                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Due Date: </label>
                    {moment(task.duedate).format('DD/MMM/YYYY hh:mm a')}
                </div>
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Actual Start Date: </label>
                    {
                        task.actualstartdate && moment(task.actualstartdate).format('DD/MMM/YYYY hh:mm a')
                    }

                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Completion Date: </label>
                    {task.completiondate && moment(task.completiondate).format('DD/MMM/YYYY hh:mm a')}

                </div>

                {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Billing Type : </label>
                    <ButtonDropdown name="billingtype" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={billingType} defaultSelectedValue="internal" />
                </div> */}
            </div>
            <div className='w-full  flex flex-row gap-2 mt-5 mb-4 '>
                <div className='basis-[50%] flex flex-row gap-3 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Status: </label>
                    <select disabled={((task.status === "Close" && task.completiondate !== null) || (user.id !== task.assigneeuserid))} className='border outline-none border-slate-400 p-1 rounded cursor-pointer' value={task.status} onChange={(e) => setTask({ ...task, status: e.target.value })}>
                        <option value="Open">Open</option>
                        <option value="Close">Close</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Hold">Hold</option>
                    </select>
                    {user.id === task.assigneeuserid && <Button disabled={(task.status === "Close" && task.completiondate !== null)} onClick={handleTaskStatusChange} className='bg-sky-600 text-white px-3 py-1 rounded disabled:bg-sky-200 font-semibold'>Save</Button>
                    }
                </div>

                {(

                    <div className='basis-[55%]  w-full  flex flex-row gap-2 mt-5 mb-4 '>
                        <div className='basis-[45%] flex flex-row gap-3 justify-start items-center'>
                            <label className='justify-self-start  font-bold basis-[35%] text-start'>Task Progress: </label>
                            <Slider
                                isDisabled={user.role === "support" || user.role === "manager" || user.role === "admin"}
                                label="Task Progress:"
                                showTooltip={true}
                                // formatOptions={{ style: "percent" }}
                                getValue={(per) => `${per} %`}
                                maxValue={100}

                                // defaultValue={task.percentage}
                                style={{ width: "400px" }}
                                // onChange={(e)=>{setTask({ ...task, percentage:(e)  })}}
                                onChange={handleSliderChange}
                                value={sliderValue ? (sliderValue) : (task.percentage)}
                            />
                            {user.id === task.assigneeuserid && task.actualstartdate && (task.status !== "Close") && (<Button onClick={handleTaskProgressSave} className='bg-sky-600 text-white px-3 py-1 rounded disabled:bg-sky-200 font-semibold'>Save</Button>)
                            }

                        </div>

                    </div>

                )}



            </div>
        </div>
    )
}

export default ViewTaskComponent

//w-full flex flex-row gap-2 mt-5 mb-4
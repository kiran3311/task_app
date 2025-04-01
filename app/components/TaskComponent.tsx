'use client'
import React, { useState, useEffect } from 'react'
import { useQuill } from "react-quilljs";
import Datetime from 'react-datetime';
import "quill/dist/quill.snow.css";
import { Textarea } from '@nextui-org/react';
import moment, { Moment } from 'moment';
import { ITask } from '../taskapp/tasks/[taskid]/edit/page';
import ButtonDropdown from '../components/ButtonDropdown';
import { axiosinstance } from '../libs/axiosinstance';
import { apiUrl } from '@/config';
import { jwtDecode } from 'jwt-decode';

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

interface IUser {
    id: number;
    fullname?: string;
    username?: string;
    role?: string;
}


interface IManagerList {
    id?: number;
    managerid: number;
    manager: IUser
}


interface IUserList {
    id?: number;
    managerid: number;
    user: IUser
}


export interface IMainTaskDetails {
    productid?: number;
    tasktype?: string;
    clientid?: number;
    projectid?: number;
    taskdescriptionid?: number;
    moduleid?: number;
}


function TaskComponent({ task, handleUpdateItem, mainTaskDetails, isRequiredError, copytask, addArr, isAddTask, onChangeAssignee, moduleaObj }: { mainTaskDetails: IMainTaskDetails, task: ITask, handleUpdateItem?: any, isRequiredError: boolean, copytask: ITask, addArr: any, isAddTask: Boolean, onChangeAssignee?: any, moduleaObj?: any }) {
    // const [descriptionforinnerhtml, setDescriptionForinnerHTML] = useState("");
    // const [descriptionforeditting, setDescriptionForEditting] = useState("");
    const [user, setUser] = useState<IUser>({
        fullname: "",
        role: "user",
        id: 0,
        username: ""
    })

    //console.log(copytask)

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
    const { quill, quillRef } = useQuill({
        formats: formats,
        modules: modules,
    });
    const priorityMap: any = {
        High: "High",
        Low: "Low",
        Medium: "Medium",
    }

    const priorityList: { key: string, value: string }[] = [
        { key: "High", value: "High" },
        { key: "Low", value: "Low" },
        { key: "Medium", value: "Medium" },
    ]
    const flagMap: any = {
        Internal: "Internal",
        External: "External"
    }
    const statusMap: any = {
        Open: "Open",
        Close: "Close",
        ["In Progress"]: "In Progress",
        Hold: "Hold"
    }


    const billingType: any = {
        Billable: "Billable",
        ["Non Billable"]: "Non Billable"
    }

    const [managerList, setManagerList] = useState<IUser[]>([])
    const [userList, setUserList] = useState<IUser[]>([])

    useEffect(() => {
        async function getAllProjectLead() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/managerusermapping/getprojectleadbyproductid/${mainTaskDetails.productid}`)
                if (data.success) {
                    setManagerList(data.data)
                    if (data.data.length > 0) {
                        handleUpdateItem(task.id, "projectleaduserid", data.data[0].id)
                    }
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllProjectLead();
    }, [mainTaskDetails.productid])

    useEffect(() => {
        async function getAllUsersForUser() {
            try {
                let endPoint = `${apiUrl}/api/managerusermapping/getusersbyprojectidandprojectleadid/${mainTaskDetails.productid}/${task.projectleaduserid}`

                if (user.role === 'support') {
                    // endPoint = `${apiUrl}/api/user/getallusers`
                    endPoint
                }
                let { data } = await axiosinstance.get(endPoint)
                if (data.success) {
                    setUserList(data.data)
                    if (data.data.length > 0) {
                        handleUpdateItem(task.id, "assigneeuserid", data.data[0].user.id)
                    }
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllUsersForUser();
    }, [mainTaskDetails.productid, task.projectleaduserid])


    const statusList: { key: string, value: string }[] = [
        { key: "Open", value: "Open" },
        { key: "Close", value: "Close" },
        { key: "In Progress", value: "In Progress" },
        { key: "Hold", value: "Hold" },
    ]

    const isValidDate = (current: any) => {
        const currentDate = current.startOf('day');
        const minDate = moment('2022-01-01').startOf('day');
        const maxDate = moment('2030-01-01').startOf('day');

        return currentDate.isSameOrAfter(minDate) && currentDate.isSameOrBefore(maxDate);
    };

    const isValidDueDate = (current: any) => {
        const currentDate = current.startOf('day');
        const minDate = moment(task.assignstartdate).startOf('day');
        const maxDate = moment('2030-01-01').startOf('day');

        return currentDate.isSameOrAfter(minDate) && currentDate.isSameOrBefore(maxDate);
    };



    /*
    useEffect(() => {
        if (quill) {
            quill.on("text-change", (delta: any, oldDelta: any, source: any) => {

                let editingContent = quill.getContents();

                let stringifyGetContents = JSON.stringify(editingContent);
                task.remarkforeditting = stringifyGetContents;

                let stringifyInnerHTML = JSON.stringify(quill.root.innerHTML);
                task.remarkforinnerhtml = stringifyInnerHTML
              });
        }
    }, [quill,task]);
   */

    /*
    if (!task.remarkforinnerhtml
        || !task.priority
        || !task.projectleaduserid
        || !task.status
        || ((typeof task.assignstartdate === 'string' && task.assignstartdate.length <= 0)
            || (task.assignstartdate instanceof Date && task.assignstartdate && task.assignstartdate.getTime() <= 0))
        || (task.assignstartdate === null || task.assignstartdate === undefined || task.assignstartdate === '')
    ) {
        // setIsRequiredError(true)
        return;
    }

    */



    return (
        <div className='flex flex-col rounded  p-2 my-6  mx-4 '>
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                {/* <div className='w-full flex flex-row gap-3 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[20%] text-end'>Task Name: </label>
                    <Input value={task.taskname} className="border mr-5" size={'sm'} type="text" label="Enter Task Name" onChange={(e) => {
                        handleUpdateItem(task.id, "taskname", e.target.value)
                    }} />
                </div> */}
            </div>

            {((user.role === "manager") || (user.role === "admin")) && (
                <div className='w-full flex flex-row gap-2 mb-6 ml-5'>
                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Module Name: </label>
                        <select className='outline-none border border-slate-400 px-2 w-full py-2 rounded' name="modulename" required disabled
                            onChange={(e) => {
                                handleUpdateItem(task.id, "moduleid", Number(e.target.value))
                            }}>
                            <option value="" className='text-slate-500/50'>Select Module</option>
                            {
                                moduleaObj?.map((m: any) => { return (<option value={m.ID} key={m.ID}>{m?.MODULENAME}</option>) })
                            }
                        </select>
                    </div>

                </div>

            )}



            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='w-full flex flex-row gap-2 justify-start items-start mb-5'>
                    <label className='justify-self-end self-start  font-bold basis-[20%] text-end'>Remarks: </label>
                    {isRequiredError && (!task.remarkforinnerhtml) && <span className='text-red-500'>*</span>}
                    <textarea value={isAddTask ? copytask.remarkforinnerhtml : task.remarkforinnerhtml} className="border mr-5 w-full p-2 outline-none" placeholder="write remarks..." onChange={(e) => {
                        handleUpdateItem(task.id, "remarkforinnerhtml", e.target.value)
                    }} ></textarea>
                    {/* <div className=" h-36 mr-5">
                        <div ref={quillRef} />
                    </div> */}
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
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Priority: </label>
                    {isRequiredError && (!task.priority) && <span className='text-red-500'>*</span>}
                    <select value={isAddTask ? copytask.priority : task.priority} onChange={(e) => {
                        handleUpdateItem(task.id, "priority", e.target.value)
                    }} className='border border-slate-400 px-2 py-2 rounded outline-none w-full'>
                        <option className='text-slate-500/50' value="">Select Priority</option>
                        {priorityList.map(priority => {
                            return (
                                <option key={priority.key} value={priority.key}>{priority.value}</option>
                            )
                        })}
                    </select>
                    {/* <ButtonDropdown name="priority" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={priorityMap} defaultSelectedValue="normal" /> */}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Project Lead: </label>
                    {isRequiredError && (!task || (task.projectleaduserid !== undefined && task.projectleaduserid <= 0)) && <span className='text-red-500'>*</span>}
                    <select value={isAddTask ? copytask.projectleaduserid : task.projectleaduserid} onChange={(e) => {
                        handleUpdateItem(task.id, "projectleaduserid", e.target.value)
                    }} className='border border-slate-400 px-2 py-1 outline-none w-full'>
                        <option className='text-slate-500/50' value="">Select Project Lead</option>
                        {managerList.map(manager => {
                            return (
                                <option key={manager.id} value={manager.id}>{manager.fullname}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            {/* <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Team Lead: </label>
                    <ButtonDropdown name="teamleaduserid" handleUpdateItem={handleUpdateItem} taskid={task.teamleaduserid} labelsMap={usersObj} defaultSelectedValue="" />
                </div> 
            </div> */}
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Assignee: </label>
                    {/* {isRequiredError && (userList[0]) && <span className='text-red-500'>*</span>} */}
                    <select value={isAddTask ? copytask.assigneeuserid : task.assigneeuser} onChange={(e) => {
                        handleUpdateItem(task.id, "assigneeuserid", e.target.value);
                        onChangeAssignee(e.target.value)
                    }} className='border border-slate-400 px-2 py-2 rounded outline-none w-full' >
                        <option className='text-slate-500/50' value="">Select Assignee</option>

                        {userList.map(u => {
                            return (
                                <option key={u?.id} value={u?.id}>{u?.fullname}</option>
                            )
                        })}
                    </select>
                    {/* <ButtonDropdown name="assigneeuserid" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={usersRoleObj} defaultSelectedValue="" /> */}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Status: </label>
                    <select value={isAddTask ? copytask.status : task.status} onChange={(e) => { handleUpdateItem(task.id, "status", e.target.value) }} className='rounded border border-slate-400 px-2 py-2 outline-none w-full'>
                        {
                            statusList.map(status => {
                                if (status.key === "Open") {
                                    return (
                                        <option key={status.key} value={status.key} >{status.value}</option>
                                    )

                                }
                                else {
                                    return (
                                        <option key={status.key} value={status.key} disabled>{status.value}</option>
                                    )
                                }

                            })
                        }
                    </select>
                    {/* <ButtonDropdown name="status" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={statusMap} defaultSelectedValue={"Open"} /> */}
                </div>
                {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Flag: </label>
                    <ButtonDropdown name="flag" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={flagMap} defaultSelectedValue="internal" />
                </div> */}
            </div>
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Assign Date: </label>
                    <Datetime dateFormat="DD/MM/YYYY" timeFormat="hh:mm a" isValidDate={isValidDate} closeOnSelect onChange={(e) => handleUpdateItem(task.id, "assignstartdate", e)} className='border border-slate-400 px-2 py-2 rounded outline-none w-full' value={moment(task.assignstartdate).isValid() ? task.assignstartdate : ""} />
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Due Date: </label>
                    {isRequiredError && (!task.duedate || (typeof task.duedate === 'string' && task.duedate.length <= 0) || (task.duedate instanceof Date && task.duedate && task.duedate.getTime() <= 0)) && <span className='text-red-500'>*</span>}
                    <Datetime dateFormat="DD/MM/YYYY" timeFormat="hh:mm a" isValidDate={isValidDueDate} closeOnSelect onChange={(e) => handleUpdateItem(task.id, "duedate", e)} className='border border-slate-400 px-2 py-2 rounded outline-none w-full' value={moment(task.duedate).isValid() ? task.duedate : ""} />
                </div>
            </div>

            {/* <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Actual Start date: </label>
                  
                    <Datetime onChange={(e) => handleUpdateItem(task.id, "actualstartdate", e)} className='border border-slate-300' value={moment(task.actualstartdate).isValid() ? task.actualstartdate : ""} />
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Completion Date: </label>
                    <Datetime onChange={(e) => handleUpdateItem(task.id, "completiondate", e)} className='border border-slate-300' value={moment(task.completiondate).isValid() ? task.completiondate : ""} />
                </div>
            </div> */}
            <div className='w-full flex flex-row gap-2 mt-7 ml-5'>


            </div>
        </div>
    )
}

export default TaskComponent
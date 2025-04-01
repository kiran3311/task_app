'use client'
import React, { useState, useEffect } from 'react'
import {
    Textarea
} from "@nextui-org/react";
// import { ChevronDownIcon } from './ChevronDownIcon';
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import ButtonDropdown from '../components/ButtonDropdown';
import Datetime from 'react-datetime';
import { ITask } from '../taskapp/tasks/[taskid]/edit/page';
import moment from 'moment';
import { axiosinstance } from '../libs/axiosinstance';
import { apiUrl } from '@/config';



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


function EditTaskComponent({ copytask, usersRoleObj, managerRoleObj, task, handleUpdateItem }: { managerRoleObj: any, task: ITask, copytask: ITask, handleUpdateItem?: any, usersRoleObj: any }) {
    // const [descriptionforinnerhtml, setDescriptionForinnerHTML] = useState("");
    // const [descriptionforeditting, setDescriptionForEditting] = useState("");

    const [managerList, setManagerList] = useState<IUser[]>([])
    const [userList, setUserList] = useState<IUser[]>([])

    useEffect(() => {
        async function getAllProjectLead() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/managerusermapping/getprojectleadbyproductid/${task.productid}`)
                if (data.success) {
                    setManagerList(data.data)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllProjectLead();
    }, [task.productid])

    useEffect(() => {
        async function getAllUsersForUser() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/managerusermapping/getusersbyprojectidandprojectleadid/${task.productid}/${task.projectleaduserid}`)
                if (data.success) {
                    setUserList(data.data)


                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllUsersForUser();
    }, [task.productid, task.projectleaduserid])

    const isValidDate = (current: any) => {
        const currentDate = current.startOf('day');
        const minDate = moment('2022-01-01').startOf('day');
        const maxDate = moment('2030-01-01').startOf('day');

        return currentDate.isSameOrAfter(minDate) && currentDate.isSameOrBefore(maxDate);
    };

    const isValidDueDate = (current: any) => {
        const currentDate = current.startOf('day');
        const minDate = moment(task.assignstartdate).startOf('day')
        const maxDate = moment('2030-01-01').startOf('day');

        return currentDate.isSameOrAfter(minDate) && currentDate.isSameOrBefore(maxDate);
    };

    const isValidActualStartDate = (current: any) => {
        const currentDate = current.startOf('day');
        const minDate = moment(task.assignstartdate).startOf('day')
        const maxDate = moment(task.duedate);

        return currentDate.isSameOrAfter(minDate) && currentDate.isSameOrBefore(maxDate);
    };

    const isValidCompletionDate = (current: any) => {
        const currentDate = current.startOf('day');
        const minDate = moment(task.assignstartdate).startOf('day')
        const maxDate = moment('2030-01-01').startOf('day');

        return currentDate.isSameOrAfter(minDate) && currentDate.isSameOrBefore(maxDate);
    };




    const { quill, quillRef } = useQuill({
        formats: formats,
        modules: modules,
    });
    const priorityMap: any = {
        High: "High",
        Low: "Low",
        Medium: "Medium",
    }

    const statusList: { key: string, value: string }[] = [
        { key: "Open", value: "Open" },
        { key: "Close", value: "Close" },
        { key: "In Progress", value: "In Progress" },
        { key: "Hold", value: "Hold" },
    ]

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



    return (
        <div className='flex flex-col rounded border p-2 my-6  mx-4 border-slate-400'>
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                {/* <div className='w-full flex flex-row gap-3 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[20%] text-end'>Task Name: </label>
                    <Input value={task.taskname} className="border mr-5" size={'sm'} type="text" label="Enter Task Name" onChange={(e) => {
                        handleUpdateItem(task.id, "taskname", e.target.value)
                    }} />
                </div> */}
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='w-full flex flex-row gap-2 justify-start items-center mb-5'>
                    <label className='justify-self-end self-start  font-bold basis-[20%] text-end'>Remarks: </label>
                    <Textarea value={task.remarkforinnerhtml} className="border mr-5" size={'sm'} type="text" label="Enter Remarks" onChange={(e) => {
                        handleUpdateItem(task.id, "remarkforinnerhtml", e.target.value)
                    }} />
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

                    <ButtonDropdown name="priority" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={priorityMap} defaultSelectedValue={task.priority} />
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Project Lead: </label>
                    {task.projectlead}
                    {/* <select onChange={(e) => {
                        handleUpdateItem(task.id, "projectleaduserid", e.target.value)
                    }} className='border border-slate-400 px-2 py-1 outline-none w-full'>
                        {managerList.map(manager => {
                            return (
                                <option key={manager.id} value={manager.id}>{manager.fullname}</option>
                            )
                        })}
                    </select> */}
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
                    <select value={task.assigneeuserid} onChange={(e) => {
                        handleUpdateItem(task.id, "assigneeuserid", e.target.value)
                    }} className='border border-slate-400 px-2 py-1 outline-none w-full'>
                        {userList.map(user => {
                            return (
                                <option key={user.id} value={user.id}>{user.fullname}</option>
                            )
                        })}
                    </select>
                </div>
                {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Flag: </label>
                    <ButtonDropdown name="flag" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={flagMap} defaultSelectedValue="internal" />
                </div> */}
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Assign Date: </label>
                    {/* <input
                        value={(task.actualstartdate || "").toString().substring(0, 16)}
                        name="flag"
                        type="datetime-local"
                        className=""
                        placeholder=""
                        onChange={(e) => handleUpdateItem(task.id, "actualstartdate", e.target.value)}
                    /> */}

                    <Datetime dateFormat="DD/MM/YYYY" timeFormat="hh:mm a" isValidDate={isValidDate} closeOnSelect
                        onChange={(e) => handleUpdateItem(task.id, "assignstartdate", e)} className='border border-slate-300 outline-none px-2 py-1  rounded' value={moment(task.assignstartdate).isValid() ? moment(task.assignstartdate) : ""} />

                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Due Date: </label>
                    {/* <input
                        value={(task.duedate || "").toString().substring(0, 16)}
                        type="datetime-local"
                        className=""
                        placeholder=""
                        onChange={(e) => handleUpdateItem(task.id, "duedate", e.target.value)}
                    /> */}
                    <Datetime dateFormat="DD/MM/YYYY" timeFormat="hh:mm a"
                        isValidDate={isValidDueDate} closeOnSelect
                        onChange={(e) => handleUpdateItem(task.id, "duedate", e)}
                        className='border border-slate-300 outline-none px-2 py-1  rounded'
                        value={moment(task.duedate).isValid() ? moment(task.duedate) : ""} />
                </div>
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>

                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Actual Start Date: </label>
                    {task.actualstartdate && moment(task.actualstartdate).format('DD/MMM/YYYY hh:mm a')}
                    {/* <input
                        value={(task.actualstartdate || "").toString().substring(0, 16)}
                        name="flag"
                        type="datetime-local"
                        className=""
                        placeholder=""
                        onChange={(e) => handleUpdateItem(task.id, "actualstartdate", e.target.value)}
                    /> */}



                    {/* <Datetime 
                  
                    isValidDate={isValidActualStartDate} 
                    dateFormat="DD/MM/YYYY" timeFormat="hh:mm a" 
                    onChange={(e) => handleUpdateItem(task.id, "actualstartdate", e)} 
                    className='border border-slate-300 outline-none px-2 py-1  rounded' 
                    value={moment(task.actualstartdate).isValid() ? moment(task.actualstartdate) : ""} 
                   
                    /> */}

                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Completion Date: </label>
                    {/* <input
                        value={(task.completiondate || "").toString().substring(0, 16)}

                        name="flag"
                        type="datetime-local"
                        className=""
                        placeholder=""
                        onChange={(e) => handleUpdateItem(task.id, "completiondate", e.target.value)}
                    /> */}

                    <Datetime isValidDate={isValidCompletionDate}
                        dateFormat="DD/MM/YYYY" timeFormat="hh:mm a"
                        onChange={(e) => handleUpdateItem(task.id, "completiondate", e)}
                        className='border border-slate-300 outline-none px-2 py-1  rounded'
                        value={moment(task.completiondate).isValid() ? moment(task.completiondate) : ""} />
                </div>

                {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Billing Type : </label>
                    <ButtonDropdown name="billingtype" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={billingType} defaultSelectedValue="internal" />
                </div> */}
            </div>
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Status: </label>
                    <select value={task.status} onChange={(e) => { handleUpdateItem(task.id, "status", e.target.value) }} className='outline-none border border-slate-400 px-2  py-2 rounded'>
                        {
                            statusList.map(status => {
                                return (
                                    <option key={status.key} value={status.key}>{status.value}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
        </div>
    )
}

export default EditTaskComponent
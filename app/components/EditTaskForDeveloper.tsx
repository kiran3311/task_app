'use client'
import React from 'react'
import moment from 'moment'
import ButtonDropdown from './ButtonDropdown';
import { ITask } from '../taskapp/tasks/[taskid]/edit/page';

function EditTaskForDeveloper({ task, handleStatusChange, timeInput, setTimeInput, handleTimeChange, error, setError }: { task: ITask, handleStatusChange: any, timeInput: any, setTimeInput: any, handleTimeChange: any, error: any, setError: any }) {

    return (
        <div className='flex flex-col rounded  mt-4  '>
            <div className='w-full flex flex-row gap-2 '>
                {/* <div className='w-full flex flex-row gap-3 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[20%] text-end'>Task Name: </label>
                    <Input value={task.taskname} className="border mr-5" size={'sm'} type="text" label="Enter Task Name" onChange={(e) => {
                        handleUpdateItem(task.id, "taskname", e.target.value)
                    }} />
                </div> */}
            </div>

            <div className='w-full flex flex-row gap-2 '>
                <div className='w-full flex flex-row gap-2 justify-start items-center mb-5'>
                    <label className='justify-self-start self-start  font-bold basis-[20%] text-start'>Remarks: </label>
                    {task.remarkforinnerhtml}
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
                        moment(task.actualstartdate).format('DD/MMM/YYYY hh:mm a')
                    }

                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Completion start date: </label>
                    {moment(task.completiondate).format('DD/MMM/YYYY hh:mm a')}

                </div>
                {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Billing Type : </label>
                    <ButtonDropdown name="billingtype" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={billingType} defaultSelectedValue="internal" />
                </div> */}
            </div>

            <div className='w-full flex flex-row gap-2 mt-5 '>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-start'>
                    <label className='justify-self-end  font-bold text-end'>Status: </label>
                    <select value={task.status} onChange={(e) => handleStatusChange(e.target.value)}>
                        <option value="open">Open</option>
                        <option value="close">Close</option>
                        <option value="inprogress">In Progress</option>
                        <option value="hold">Hold</option>
                    </select>
                </div>
                <div className='flex flex-col'>
                    {task.status === "close" && (
                        <div className='flex flex-row gap-1 items-center'>
                            <label className='font-bold'>Time (hh:mm):</label>
                            <input className='border border-slate-300 px-2 py-1 outline-none rounded' type="text" value={timeInput} onChange={handleTimeChange} placeholder='hh:mm' />
                        </div>
                    )}
                    {task.status === "close" && error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default EditTaskForDeveloper
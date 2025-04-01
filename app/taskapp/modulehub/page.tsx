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
    TableCell, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

interface IModule {
    ID: number;
    MODULENAME: string;
    moduledescription: string;
    WEIGHTAGE: string;
    project: IProject;
}

interface IProject {
    id: number;
    PROJECTNAME: string;
}

interface IUser {
    fullname?: string;
    role?: string;
    id?: number;
    username?: string;
}

function ModulesHubPage() {
    const router = useRouter();
    const [modulesList, setModulesList] = useState<IModule[]>([])
    const [user, setUser] = useState<IUser>({
        fullname: "",
        role: "user",
        id: 0,
        username: ""
    })
    const [searchList, setSearchList] = useState()

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

    useEffect(() => {
        async function getAllModules() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/module/getallmodules`)
                if (data.success) {
                    setModulesList(data.data)
                }
            } catch (err) {
                console.log("Error in getAllModules API", err)
            }
        }
        getAllModules();
    }, [searchList])

    //console.log(modulesList)

    const handleDelete = async (moduleid: any, moduleName: any) => {
        
        const result = window.confirm(`Are you sure you want to Delete "${moduleName}" module ?`)
        if (result) {
            try {
                const endpoint = `${apiUrl}/api/module/deletemodulekbyid/${moduleid}`
                const { data } = await axiosinstance.delete(endpoint)
                if (data.success) {
                    window.alert("Module Deleted Successfully")
                    setSearchList(data.data)
                    toast.success("Module Deleted Succesfully", { autoClose: 600 })

                }
            } catch (error) {
                console.log(error)
            }

        }

        else {
            router.push("/taskapp/module")
        }

    }


    return (
        <div className='flex flex-col w-full'>

            <div className='flex flex-row justify-between w-full mt-5'>
                <Breadcrumbs classNames={{
                    list: "bg-slate-600",
                }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/module")}>Modules</BreadcrumbItem>
                </Breadcrumbs>
                <button onClick={() => router.push("/taskapp/module/createmodule")} className='bg-sky-600 text-white px-3 py-1 rounded'>Create Module</button>
            </div>
            {<div className='flex flex-row justify-center mt-4'>
                <Table aria-label="Example collection table">
                    <TableHeader>
                        <TableColumn>Sr No.</TableColumn>
                        <TableColumn>Module Name</TableColumn>
                        <TableColumn>Project Name</TableColumn>
                        <TableColumn>Weightage</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {modulesList?.map((module, index) => {
                            return (
                                <TableRow key={module.ID}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{module?.MODULENAME}</TableCell>
                                    <TableCell>{module?.project?.PROJECTNAME}</TableCell>
                                    <TableCell>{module?.WEIGHTAGE}</TableCell>
                                    <TableCell>
                                        <Link href={`/taskapp/module/${module.ID}`} className='px-2  inline-flex text-center' >
                                            <Tooltip content="View" color='warning' closeDelay={100}>
                                                <span> <FaEye className='text-orange-600 text-xl' /></span>
                                            </Tooltip>
                                        </Link>
                                        {/* <Link href={`/taskapp/tasks/${task.id}/edittask`}   className='bg-red-500 text-white px-3 py-1 rounded ml-2' >
                                            Edit percentage
                                        </Link>   */}
                                        {
                                            (user.role === "admin" || user.role === "manager") && (
                                                <Link href={`/taskapp/module/${module.ID}/editmodule`} className='px-2  inline-flex text-center' >
                                                    <Tooltip content="Edit" color='primary' closeDelay={100}>
                                                        <span><MdEdit className='text-blue-800 text-xl' /></span>
                                                    </Tooltip>
                                                </Link>
                                            )}
                                        {
                                            (user.role === "admin" || user.role === "manager") && (
                                                <button className=' px-2  inline-flex text-center ' onClick={() => { handleDelete(module.ID, module?.MODULENAME) }}>
                                                    <Tooltip content="Delete" color='danger' closeDelay={100}>
                                                        <span> <MdDelete className='text-red-700 text-xl' /></span>
                                                    </Tooltip>
                                                </button>
                                            )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </div>}
        </div>
    )
}

export default ModulesHubPage
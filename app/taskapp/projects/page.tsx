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
    TableCell, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

interface IProduct{
    id?:number;
    productcode?:string;
    productname?:string;
}
interface IProject {
    id?: number;
    projectcode: string;
    projectcategory: string;
    projectname: string;
    productid?:number;
    product:IProduct
}


function ProjectsPage() {
    const router = useRouter();
    const [projectsList, setProjectsList] = useState<IProject[]>([])

    useEffect(() => {
        async function getAllProjects() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/project/getallproject`)
                if (data.success) {
                    setProjectsList(data.data)    
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllProjects();
    }, [])


    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row justify-between w-full mt-5'>
                <Breadcrumbs  classNames={{
                   list: "bg-slate-600",
               }}
               itemClasses={{
                   item: "text-white",
                   separator: "text-white",
               }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/projects")}>Projects</BreadcrumbItem>
                </Breadcrumbs>
                <button onClick={() => router.push("/taskapp/projects/createproject")} className='bg-sky-500 text-white px-3 py-1 rounded'>Create Project</button>
            </div>
            <div className='flex flex-row justify-center mt-4'>
                <Table aria-label="Example collection table">
                    <TableHeader>
                        <TableColumn>Sr No.</TableColumn>
                        <TableColumn>Product Name</TableColumn>
                        <TableColumn>Project Code</TableColumn>
                        <TableColumn>Project Category</TableColumn>
                        <TableColumn>Project Name</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {projectsList.map((project, index) => {
                            return (
                                <TableRow key={project.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{project.product.productname}</TableCell>
                                    <TableCell>{project.projectcode}</TableCell>
                                    <TableCell>{project.projectcategory}</TableCell>
                                    <TableCell>{project.projectname}</TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ProjectsPage
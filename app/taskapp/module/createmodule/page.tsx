'use client'
import ButtonDropdown from '@/app/components/ButtonDropdown';
import { axiosinstance } from '@/app/libs/axiosinstance';
import { apiUrl } from '@/config';
import { Input, Textarea } from '@nextui-org/react';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
type Key = string | number;
export type IKeyValue = {
    [K in Key]: string;
};

interface IModule {
    id?: number;
    modulename?: string;
    moduledescription?: string;
    projectid?: Number;
    weightage?: Number;
    modulehubid?: Number;
}

interface IProject {
    id: number;
    projectname: string;
    projectdescription: string;
}
function CreateModulePage() {
    const router = useRouter();
    const [moduleDetails, setModuleDetails] = useState<IModule>({
        modulename: "",
        moduledescription: "",
        projectid: 0,
        weightage: 0,
        modulehubid:0,
    })

    const formatDataForProjectDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, projectname }: { id: number, projectname: string }) => {
            acc[id] = projectname;
            return acc;
        }, {} as any);
        return user
    }

    const [projectsObj, setProjectsObj] = useState<IKeyValue>({})

    useEffect(() => {
        async function getAllProjects() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/project/getallproject`)
                if (data.success) {
                    const projects: IKeyValue = formatDataForProjectDropdown(data.data)
                    setProjectsObj(projects)
                }
            } catch (err) {
                console.log("Error in getallproject API", err)
            }
        }
        getAllProjects();
    }, [])

    const handleUpdateItem = (taskid: string, name: string, value: string) => {
        setModuleDetails({ ...moduleDetails, [name]: Number(value) })

    }

    const handleCreateProject = async () => {
        console.log("MD =>", moduleDetails)
        try {
            const endpoint = `${apiUrl}/api/module/createmodule`
            const { data } = await axiosinstance.post(endpoint, moduleDetails)
            if (data.success) {
                return router.push("/taskapp/module")
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-col w-full mt-5 ml-3'>
                <Breadcrumbs  classNames={{
                   list: "bg-slate-600",
               }}
               itemClasses={{
                   item: "text-white",
                   separator: "text-white",
               }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/module")}>Modules</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/module/createmodule")} >Create Module</BreadcrumbItem>
                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Create Module</h2>
                <div className='basis-[47%] flex flex-col mt-4 gap-2 justify-start items-start'>
                    <label className='justify-self-start  font-bold basis-[35%] text-end'>Project Name: </label>
                    <ButtonDropdown name="projectid" handleUpdateItem={handleUpdateItem} labelsMap={projectsObj} defaultSelectedValue="" />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Module Name: </label>
                    <Input type="text" className='rounded' placeholder='Enter Module Name' onChange={(e) => setModuleDetails({ ...moduleDetails, modulename: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Module Description: </label>
                    <Textarea className='rounded' multiple type="text" placeholder='Enter Module Description' onChange={(e) => setModuleDetails({ ...moduleDetails, moduledescription: e.target.value })} />
                </div>
                
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Weightage: </label>
                    <Input type="number" className='rounded' placeholder='Enter Module Weightage' onChange={(e) => setModuleDetails({ ...moduleDetails, weightage: Number(e.target.value) })} 
                      onKeyPress={(e) => {
                        // Prevent non-numeric characters from being entered
                        const charCode = e.which ? e.which : e.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                            e.preventDefault();
                        }
                    }}/>
                </div>
                <div className='mt-4'>
                    <button onClick={() => handleCreateProject()} className='bg-sky-600 text-white px-3 py-1 rounded'>Create Project</button>
                </div>
            </div>
        </div>
    )
}

export default CreateModulePage
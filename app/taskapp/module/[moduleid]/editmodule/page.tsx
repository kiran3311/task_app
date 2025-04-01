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

interface IProduct {
    id?: number;
    productcode?: string;
    productname: string;
}

interface IModule {
    id?: number;
    modulename?: string;
    moduledescription?: string;
    projectid?: Number;
    weightage?: Number;
}

interface IProject {
    id: number;
    projectname: string;
    projectdescription: string;
}

function EditModule({ params }: { params: { moduleid: number } }) {
    const router = useRouter();
    const [module, setModule] = useState<any>()
    const [moduleDetails, setModuleDetails] = useState<IModule>({
        modulename: module?.MODULENAME,
        moduledescription: module?.MODULEDESCRIPTION,
        projectid: module?.project?.ID,
        weightage:module?.WEIGHTAGE
    })
    const [projectKeys, setProjectKeys] = useState<any>([])

    const formatDataForProjectDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, projectname }: { id: number, projectname: string }) => {
            acc[id] = projectname;
            return acc;
        }, {} as any);
        return user
    }

    const [projectsObj, setProjectsObj] = useState<IKeyValue>({})

    useEffect(() => {
        async function getmodulebymoduleid() {
            try {
                const { data } = await axiosinstance.get(`${apiUrl}/api/module/getmodulebyid/${Number(params.moduleid)}`)

                setModule(data.data)
            } catch (error) {
                console.log(error)
            }
        }
        getmodulebymoduleid()
    }, [params.moduleid])


    console.log("edit module projects", projectsObj)

    useEffect(() => {
        async function getAllProjects() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/project/getallproject`)
                if (data.success) {
                    const projects: IKeyValue = formatDataForProjectDropdown(data.data)
                    setProjectsObj(projects)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
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

    const handleUpdateModule = async()=>{
        try {
            const endpoint = `${apiUrl}/api/module/updatemodule/${Number(params.moduleid)}`
            const{data} = await axiosinstance.put(endpoint,moduleDetails)
            if(data.success){
                window.alert("Module Updated successfully")
                return router.push("/taskapp/module")

            }
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        const keys = Object.keys(projectsObj)
        setProjectKeys(keys)
    }, [projectsObj])
    console.log(projectKeys, projectsObj[projectKeys[0]])


    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-col w-full mt-5 ml-3'>
                <Breadcrumbs classNames={{
                    list: "bg-slate-600",
                }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/module")}>Modules</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/module/createmodule")} >Edit Module</BreadcrumbItem>
                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Create Module</h2>
                <div className='basis-[47%] flex flex-col mt-4 gap-2 justify-start items-start'>
                    <label className='justify-self-start  font-bold basis-[35%] text-end'>Project Name: </label>
                    {/* <ButtonDropdown name="projectid" handleUpdateItem={handleUpdateItem} labelsMap={projectsObj} defaultSelectedValue="" value={module.project.PROJECTNAME}/> */}
                    <select className='outline-none border border-slate-400 px-2 w-full py-2 rounded' value={module?.project?.ID}
                        onChange={(e) => {
                            const selectedProjectId = Number(e.target.value);
                            setModuleDetails({ ...moduleDetails, projectid: Number(e.target.value) });
                            setModule((prevModule: any) => ({
                                ...prevModule,
                                project: {
                                    ...prevModule.project,
                                    ID: selectedProjectId
                                }
                            }))
                        }}>

                        {Object.keys(projectsObj).map((key: any) => {
                            return (<option key={key} value={key}> {projectsObj[key]}</option>)
                        })}

                    </select>
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Module Name: </label>
                    <Input type="text" className='rounded' placeholder='Enter Module Name' value={module?.MODULENAME}
                        onChange={(e) => {
                            setModuleDetails({ ...moduleDetails, modulename: e.target.value });
                            const newModuleName = e.target.value;
                            setModule((prevState: any) => ({ ...prevState, MODULENAME: newModuleName }))
                        }} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Module Description: </label>
                    <Textarea className='rounded' multiple type="text" placeholder='Enter Module Description' value={module?.MODULEDESCRIPTION} 
                    onChange={(e) => {setModuleDetails({ ...moduleDetails, moduledescription: e.target.value })
                    const newModuleDesc = e.target.value;
                            setModule((prevState: any) => ({ ...prevState, MODULEDESCRIPTION: newModuleDesc }))
                }
                    } />
                </div>

                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Weightage: </label>
                    <Input type='Number' className='rounded' placeholder='Enter Module Weightage' value={module?.WEIGHTAGE} 
                    onChange={(e) => {
                    const newWeightage = e.target.value;
                    const numericInput = newWeightage.replace(/\D/, '');
                    setModuleDetails({ ...moduleDetails, weightage: Number(numericInput) })
                            setModule((prevState: any) => ({ ...prevState, WEIGHTAGE: numericInput }))
                            
                    }} 
                    onKeyPress={(e) => {
                        // Prevent non-numeric characters from being entered
                        const charCode = e.which ? e.which : e.keyCode;
                        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                            e.preventDefault();
                        }
                    }}/>
                </div>
                <div className='mt-4'>
                    <button onClick={() => handleUpdateModule()} className='bg-sky-600 text-white px-3 py-1 rounded'>Update Module</button>
                </div>
            </div>
        </div>
    )
}

export default EditModule
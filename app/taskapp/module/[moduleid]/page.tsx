'use client'
import { axiosinstance } from '@/app/libs/axiosinstance';
import { apiUrl } from '@/config';
import { Input, Textarea } from '@nextui-org/react';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect, FormEvent } from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";

type Key = string | number;
export type IKeyValue = {
    [K in Key]: string;
};

interface IProduct {
    id?: number;
    productcode?: string;
    productname: string;
}

interface IProject {
    id: number;
    projectname: string;
    projectdescription: string;
}

interface IModule {
    id?: number;
    modulename?: string;
    moduledescription?: string;
    weightage?: Number;
    projectid?: Number

}



function ViewModule({ params }: { params: { moduleid: number } }) {

    const router = useRouter();

    // const [module, setModule] = useState<IModule>({
    //     id: 0,
    //     modulename: "",
    //     moduledescription: "",
    //     weightage: 0,
    //     projectid: 0
    // })

    const [module, setModule] = useState<any>()

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

    //console.log(module)

    return (
        <div className='mt-4 flex flex-col w-full'>
            <Breadcrumbs
                classNames={{
                    list: "bg-slate-600",
                }}
                itemClasses={{
                    item: "text-white",
                    separator: "text-white",
                }}
                variant='solid' className='mt-4'>
                <BreadcrumbItem onClick={() => router.push("/taskapp/module")} >Module</BreadcrumbItem>
                <BreadcrumbItem onClick={() => router.push(`/taskapp/module/${module?.ID}`)}>{module?.MODULENAME}</BreadcrumbItem>
            </Breadcrumbs>
            <div className='flex flex-col mt-4 border border-sky-400 bg-white p-4 rounded'>
                <p className='font-bold text-xl underline'>Module Details:</p>
                <div>
                    <div className='flex flex-row mt-6 gap-4 items-center'>
                        <p className='font-bold'>Module Name: </p>
                        <p >{module?.MODULENAME}</p>
                    </div>
                    <div className='flex flex-row mt-4 gap-4 items-center'>
                        <p className='font-bold'>Project: </p>
                        <p >{module?.project?.PROJECTNAME}</p>
                    </div>
                    <div className='flex flex-row mt-4 gap-4 items-center'>
                        <p className='font-bold'>Module Decription : </p>
                        <p >{module?.MODULEDESCRIPTION}</p>
                    </div>
                    <div className='flex flex-row mt-4 gap-4 items-center'>
                        <p className='font-bold'>Weightage : </p>
                        <p >{module?.WEIGHTAGE} %</p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ViewModule
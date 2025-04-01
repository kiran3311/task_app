'use client'
import { axiosinstance } from '@/app/libs/axiosinstance';
import { apiUrl } from '@/config';
import { Input, Textarea } from '@nextui-org/react';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import ButtonDropdown from '@/app/components/ButtonDropdown';
interface IProject {
    id?: number;
    projectcode: string;
    projectcategory: string;
    projectname: string;
    productid: number;
    clientid?: number;
}
type Key = string | number;
export type IKeyValue = {
    [K in Key]: string;
};
function CreateProjectPage() {
    const router = useRouter();
    const [projectDetails, setProjectDetails] = useState<IProject>({
        projectcode: "",
        projectcategory: "",
        projectname: "",
        productid: 0,
        clientid:0
    });

    const [productsObj, setProductsObj] = useState<IKeyValue>({})

    const formatDataForProductDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, productname }: { id: number, productname: string }) => {
            acc[id] = productname;
            return acc;
        }, {} as any);
        return user
    }

    useEffect(() => {
        async function getAllProducts() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/product/getallproducts`)
                if (data.success) {
                    const projects: IKeyValue = formatDataForProductDropdown(data.data)
                    setProductsObj(projects)
                }
            } catch (err) {
                console.log("Error in getAllProducts API", err)
            }
        }
        getAllProducts();
    }, []);

    const handleUpdateItem = (taskid: string, name: string, value: string) => {
        setProjectDetails({ ...projectDetails, [name]: value })
    }

    const handleCreateProject = async () => {
        try {
            const endpoint = `${apiUrl}/api/project/createproject`
            const { data } = await axiosinstance.post(endpoint, projectDetails)
            if (data.success) {
                window.alert(data.message)
                return router.push("/taskapp/projects")
            }
        } catch (err) {
            console.log(err)
        }
    }


    const formatDataForClientDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, clientname }: { id: number, clientname: string }) => {
            acc[id] = clientname;
            return acc;
        }, {} as any);
        return user
    }


    
    const [clientsObj, setClientsObj] = useState<IKeyValue>({})

    useEffect(() => {
        async function getAllClients() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/client/getallclient`)
                if (data.success) {
                    const clients = formatDataForClientDropdown(data.data)
                    setClientsObj(clients)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllClients();
    }, [])


    // useEffect(() => {
    //     async function getAllClients() {
    //         try {
    //             let { data } = await axiosinstance.get(`${apiUrl}/api/client/getallclients`)
    //             if (data.success) {
    //                 const projects: IKeyValue = formatDataForProductDropdown(data.data)
    //                 setProductsObj(projects)
    //             }
    //         } catch (err) {
    //             console.log("Error in getAllProducts API", err)
    //         }
    //     }
    //     getAllClients();
    // }, []);

    

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
                    <BreadcrumbItem onClick={() => router.push("/taskapp/projects")}>Projects</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/projects/createproject")} >Create Project</BreadcrumbItem>

                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Create Project</h2>
                <div className='basis-[47%] flex flex-col gap-2 justify-start items-start mt-4'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Select Product : </label>
                    <ButtonDropdown name="productid" handleUpdateItem={handleUpdateItem} labelsMap={productsObj} defaultSelectedValue="" />
                </div>
                {/* <div className='basis-[47%] flex flex-col gap-2 justify-start items-start mt-4'>
                    <label className='justify-self-start  font-bold basis-[35%] text-start'>Select Client Name: </label>
                    <ButtonDropdown name="clientid" handleUpdateItem={handleUpdateItem} labelsMap={clientsObj} defaultSelectedValue="" />
                </div> */}
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Project Code: </label>
                    <Input type="text" className='rounded' placeholder='Enter Project Code' onChange={(e) => setProjectDetails({ ...projectDetails, projectcode: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Project Category: </label>
                    <Input type="text" className='rounded' placeholder='Enter Project Category' onChange={(e) => setProjectDetails({ ...projectDetails, projectcategory: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Project Name: </label>
                    <Input className='rounded' multiple type="text" placeholder='Enter Project Name' onChange={(e) => setProjectDetails({ ...projectDetails, projectname: e.target.value })} />
                </div>
                

                <div className='mt-4'>
                    <button onClick={() => handleCreateProject()} className='bg-sky-600 text-white px-3 py-1 rounded'>Create Project</button>
                </div>
            </div>
        </div>
    )
}

export default CreateProjectPage
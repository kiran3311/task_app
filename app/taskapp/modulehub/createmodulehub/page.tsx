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
    productid?: number;
    productcode?: string;
    productname?: string;
}

interface Imodulehub {
    id?: number;
    hubname?: string;
    hubdetails?: string;
    productid?: string;
    hubcode?: string;
}

 
function CreateModulehubPage() {
    const router = useRouter();
    const [modulehub, setModulehub] = useState<Imodulehub>({

        hubname: "",
        hubdetails: "",
        productid: "",
        hubcode: ""
    })

    const [productDetails, setProductDetails] = useState<IProduct[]>([])


    useEffect(() => {
        async function getAllProducts() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/product/getallproductsfortask`)
                if (data.success) {
                    setProductDetails(data.data)

                }
            } catch (err) {
                console.log("Error in getAllProducts API", err)
            }
        }
        getAllProducts();

    }, []);

    //console.log(productDetails)

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
                    <BreadcrumbItem onClick={() => router.push("/taskapp/modulehub")}>Modules Hub</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/modulehub/createmodulehub")} >Create Module Hub</BreadcrumbItem>
                </Breadcrumbs>

                <h2 className='font-bold text-xl mt-4'>Create Module Hub</h2>

                <div className='flex flex-col m-4 gap-2'>
                    <label className='font-bold'>Module Hub Name: </label>
                    <Input type="text" className='rounded' placeholder='Enter Module Hub  Name' onChange={(e) => setModulehub({ ...modulehub, hubname: e.target.value })} />
                </div>
            </div>
        </div>
    )

}


export default CreateModulehubPage
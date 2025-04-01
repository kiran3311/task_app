'use client'
import { axiosinstance } from '@/app/libs/axiosinstance';
import { apiUrl } from '@/config';
import { Input, Textarea } from '@nextui-org/react';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
interface IProduct {
    id?: number;
    productcode?: string;
    productname: string;
}
function CreateProductPage() {
    const router = useRouter();
    const [productDetails, setProductDetails] = useState<IProduct>({
        productcode: "",
        productname: ""
    })

    const handleCreateProject = async () => {
        try {
            const endpoint = `${apiUrl}/api/product/createproduct`
            const { data } = await axiosinstance.post(endpoint, productDetails)
            if (data.success) {
                window.alert(data.message)
                return router.push("/taskapp/products")
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-col w-full mt-5 ml-3'>
                <Breadcrumbs
                    classNames={{
                        list: "bg-slate-600",
                    }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/products")}>Product</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/products/createproduct")} >Create Product</BreadcrumbItem>

                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Create Product</h2>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Product Code: </label>
                    <Input type="text" className='rounded' placeholder='Enter Project Name' onChange={(e) => setProductDetails({ ...productDetails, productcode: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Product Name: </label>
                    <Textarea className='rounded' multiple type="text" placeholder='Enter Project Description' onChange={(e) => setProductDetails({ ...productDetails, productname: e.target.value })} />
                </div>

                <div className='mt-4'>
                    <button onClick={() => handleCreateProject()} className='bg-sky-600 text-white px-3 py-1 rounded'>Create Product</button>
                </div>
            </div>
        </div>
    )
}

export default CreateProductPage
'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import { Input, Textarea } from '@nextui-org/react';
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { axiosinstance } from '@/app/libs/axiosinstance';
import {
    
    Button,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
interface IProduct {
    id?: number;
    productcode?: string;
    productname: string;
}

function EditProduct({ params }: { params: { productid: number } }) {
    const router = useRouter();
    const [productsList, setProductsList] = useState<IProduct>(
        {
            id: 0,
            productcode: "",
            productname: ""
        }
    )

    useEffect(() => {
        async function getProduct() {
            const { data } = await axiosinstance.get(`${apiUrl}/api/product/getproductbyid/${params.productid}`)
            setProductsList(data.data)

        }
        getProduct()
    }, [params.productid])



    const handleUpdateProject = async () => {
        try {
            const endpoint = `${apiUrl}/api/product/editproduct/${params.productid}`
            const { data } = await axiosinstance.put(endpoint, productsList)
            if (data.success) {
                window.alert(data.message)
                return router.push("/taskapp/products")
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
           
            <div className='flex flex-col w-full'>
            <div className='flex flex-col w-full mt-5 ml-3'>
                <Breadcrumbs  classNames={{
                   list: "bg-slate-600",
               }}
               itemClasses={{
                   item: "text-white",
                   separator: "text-white",
               }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/products")}>Product</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/products/createproduct")} >Edit Product</BreadcrumbItem>

                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Create Product</h2>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Product Code: </label>
                    <Input type="text" className='rounded' placeholder='Enter Project Name' value={productsList.productcode} onChange={(e) => setProductsList({ ...productsList, productcode: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Product Name: </label>
                    <Textarea className='rounded' multiple type="text" placeholder='Enter Project Description' value={productsList.productname} onChange={(e) => setProductsList({ ...productsList, productname: e.target.value })} />
                </div>

                <div className='mt-4'>
                    <button onClick={() => handleUpdateProject()} className='bg-sky-600 text-white px-3 py-1 rounded'>Update Product</button>
                </div>
            </div>
        </div>






        </>




    )


}


export default EditProduct
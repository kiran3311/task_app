'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { axiosinstance } from '@/app/libs/axiosinstance';
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
interface IProduct {
    id?: number;
    productcode?: string;
    productname: string;
}

function ViewProduct({ params }: { params: { productid: number } }) {
    const router = useRouter();
    const [product, setProduct] = useState<IProduct>(
        {
            id: 0,
            productcode: "",
            productname: ""
        }
    )

    useEffect(() => {
        async function getProduct() {
            const { data } = await axiosinstance.get(`${apiUrl}/api/product/getproductbyid/${params.productid}`)
            setProduct(data.data)
        }
        getProduct()
    }, [params.productid])

    return (

        <div className='flex flex-col mt-4 w-full'>
            <Breadcrumbs
                classNames={{
                    list: "bg-slate-600",
                }}
                itemClasses={{
                    item: "text-white",
                    separator: "text-white",
                }}
                variant='solid' className='mt-4'>
                <BreadcrumbItem onClick={() => router.push("/taskapp/products")} >Products</BreadcrumbItem>
                <BreadcrumbItem onClick={() => router.push(`/taskapp/products/${product.id}`)}>{product.productcode}</BreadcrumbItem>
            </Breadcrumbs>
            <div className='flex flex-col mt-4 border border-slate-500  bg-white p-4 rounded'>
                <p className='font-bold text-xl underline'>Product Details:</p>
                <div>
                    <div className='flex flex-row mt-6 gap-4 items-center'>
                        <p className='font-bold'>Product Code: </p>
                        <p >{product.productcode}</p>
                    </div>
                    <div className='flex flex-row mt-4 gap-4 items-center'>
                        <p className='font-bold'>Product Name: </p>
                        <p >{product.productname}</p>
                    </div>

                </div>
            </div>

        </div>





    )


}


export default ViewProduct
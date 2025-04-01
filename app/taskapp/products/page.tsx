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
interface IProduct {
    id?: number;
    productcode?: string;
    productname: string;
}
function ProductsPage() {
    const router = useRouter();
    const [productsList, setProductsList] = useState<IProduct[]>([])

    useEffect(() => {
        async function getAllProducts() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/product/getallproducts`)
                if (data.success) {
                    setProductsList(data.data)
                }
            } catch (err) {
                console.log("Error in getAllProducts API", err)
            }
        }
        getAllProducts();
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
               }}
                    variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/products")}>Products</BreadcrumbItem>
                </Breadcrumbs>
                <button onClick={() => router.push("/taskapp/products/createproduct")} className='bg-sky-600 text-white px-3 py-1 rounded'>Create Product</button>
            </div>
            <div className='flex flex-row justify-center mt-4'>
                <Table classNames={{ }} color='primary' aria-label="Product table">
                    <TableHeader >
                        <TableColumn >Sr No.</TableColumn>
                        <TableColumn>Product Code</TableColumn>
                        <TableColumn>Product Name</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {productsList.map((product, index) => {
                            return (
                                <TableRow key={product.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{product.productcode}</TableCell>
                                    <TableCell>{product.productname}</TableCell>
                                    <TableCell>
                                        <>
                                            <button onClick={() => router.push(`/taskapp/products/${product.id}`)} className='bg-orange-400 text-white px-3 py-1 rounded mr-2'>View </button>
                                            <button onClick={() => router.push(`/taskapp/products/${product.id}/editproduct/`)} className='bg-orange-400 text-white px-3 py-1 rounded'>Edit</button>
                                        </>

                                    </TableCell>
                                    {/* <TableCell>View</TableCell> */}
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ProductsPage
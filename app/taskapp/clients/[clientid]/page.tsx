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

interface IClient {
    id?: number;
    clientcode?: string;
    clientname?: string;
    clientdetails?: string;
    products: IProduct[]
}


function ViewClient({ params }: { params: { clientid: number } }) {

    const router = useRouter();

    const [client, setClient] = useState<IClient>({
        id: 0,
        clientcode: "",
        clientname: "",
        clientdetails: "",
        products: []
    })

    useEffect(() => {
        async function getclientbyclientid() {
            try {
                const { data } = await axiosinstance(`${apiUrl}/api/client/getclientbyclientid/${params.clientid}`)
   
                setClient(data.data)
            } catch (error) {
                console.log(error)
            }
        }
        getclientbyclientid()
    }, [params.clientid])

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
                <BreadcrumbItem onClick={() => router.push("/taskapp/clients")} >Client</BreadcrumbItem>
                <BreadcrumbItem onClick={() => router.push(`/taskapp/clients/${client.id}`)}>{client.clientname}</BreadcrumbItem>
            </Breadcrumbs>
            <div className='flex flex-col mt-4 border border-sky-400 bg-white p-4 rounded'>
                <p className='font-bold text-xl underline'>Client Details:</p>
                <div>
                    <div className='flex flex-row mt-6 gap-4 items-center'>
                        <p className='font-bold'>Client Code: </p>
                        <p >{client.clientcode}</p>
                    </div>
                    <div className='flex flex-row mt-4 gap-4 items-center'>
                        <p className='font-bold'>Client Name: </p>
                        <p >{client.clientname}</p>
                    </div>
                    <div className='flex flex-col mt-4'>
                        <p className='font-bold'>Products : </p>
                        <div className='flex flex-row flex-wrap mt-2'>
                            {client.products.map(product => {
                                return (
                                    <div className='mr-2 mt-2 px-3 text-sm py-1 border border-sky-200 bg-slate-50 rounded-full' key={product.id}>
                                        {product.productcode}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ViewClient
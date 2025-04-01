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
    isChecked: boolean
}


interface IClient {
    id?: number;
    clientcode?: string;
    clientname?: string;
    clientdetails?: string;
    products: IProduct[];
}

function EditClientPage({ params }: { params: { clientid: number } }) {
    const router = useRouter();

    const [defaultValues, setDefaultValues] = useState<string[]>([])
    const [selectedProducts, setSelectedProducts] = useState<string[] | FormEvent<HTMLDivElement>>([])
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
                const { data } = await axiosinstance(`${apiUrl}/api/client/getclientandproductmappingbyclientid/${params.clientid}`)

                setClient(data.data.clients)
                setDefaultValues(data.data.defaultValues)
            } catch (error) {
                console.log(error)
            }
        }
        getclientbyclientid()
    }, [params.clientid])



    const handleCreateClient = async () => {
        try {
            const body = {
                ...client,
                productList: selectedProducts
            }
            const endpoint = `${apiUrl}/api/client/creatclient`
            const { data } = await axiosinstance.post(endpoint, body)
            if (data.success) {
                window.alert(data.message)
                return router.push("/taskapp/clients")
            }

        } catch (err) {
            console.log(err)
        }
    }




    const handleOnChangeClients = (value: string[] | FormEvent<HTMLDivElement>) => {
        setSelectedProducts(value)
        console.log(value)
    }


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
                    <BreadcrumbItem onClick={() => router.push("/taskapp/clients")}>Clients</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push(`/taskapp/clients/${client.id}`)} >{client?.clientcode}</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push(`/taskapp/clients/${client.id}/edit`)} >Edit</BreadcrumbItem>
                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Edit Client</h2>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Client Code: </label>
                    <Input value={client.clientcode} type="text" className='rounded' placeholder='Enter Client Code' onChange={(e) => setClient({ ...client, clientcode: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Client Name: </label>
                    <Input type="text" value={client.clientname} className='rounded' placeholder='Enter Client Name' onChange={(e) => setClient({ ...client, clientname: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Client Details: </label>
                    <Textarea value={client.clientdetails} className='rounded' multiple type="text" placeholder='Enter client Details' onChange={(e) => setClient({ ...client, clientdetails: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    {client.products.length > 0 && defaultValues.length > 0 && (
                        <CheckboxGroup
                            label="Select Products"
                            orientation="horizontal"
                            color="default"
                            onChange={(value) => handleOnChangeClients(value)}
                            defaultValue={defaultValues}
                        >
                            {client.products.map(product => {
                                return (
                                    <Checkbox key={product.id} value={product.id?.toString()}>{product.productcode}</Checkbox>
                                )
                            })}

                        </CheckboxGroup>
                    )}
                </div>
                <div className='mt-4'>
                    <button onClick={() => handleCreateClient()} className='bg-sky-600 text-white px-3 py-1 rounded'>Edit  Client</button>
                </div>
            </div>
        </div>
    )
}

export default EditClientPage
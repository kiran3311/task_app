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
}

function CreateClientPage() {
    const router = useRouter();
    const [client, setClient] = useState<IClient>({
        clientcode: "",
        clientname: "",
        clientdetails: ""
    })

    const [products, setProducts] = useState<IProduct[]>([])
    const [selectedProducts, setSelectedProducts] = useState<string[] | FormEvent<HTMLDivElement>>([])



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


    useEffect(() => {
        async function getAllProducts() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/product/getallproducts`)
                if (data.success) {
                    setProducts(data.data)
                }
            } catch (err) {
                console.log("Error in getAllProjects API", err)
            }
        }
        getAllProducts();
    }, [])

    const handleOnChangeClients = (value: string[] | FormEvent<HTMLDivElement>) => {
        setSelectedProducts(value)
    }


    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-col w-full mt-5 ml-3'>
                <Breadcrumbs   classNames={{
                   list: "bg-slate-600",
               }}
               itemClasses={{
                   item: "text-white",
                   separator: "text-white",
               }}variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/clients")}>Clients</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/clients/createclient")} >Create Client</BreadcrumbItem>
                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Create Client</h2>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Client Code: </label>
                    <Input type="text" className='rounded' placeholder='Enter Client Code' onChange={(e) => setClient({ ...client, clientcode: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Client Name: </label>
                    <Input type="text" className='rounded' placeholder='Enter Client Name' onChange={(e) => setClient({ ...client, clientname: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Client Details: </label>
                    <Textarea className='rounded' multiple type="text" placeholder='Enter client Details' onChange={(e) => setClient({ ...client, clientdetails: e.target.value })} />
                </div>
                <div className='flex flex-col mt-4'>
                    <CheckboxGroup
                        label="Select Products"
                        orientation="horizontal"
                        color="default"
                        onChange={(value) => handleOnChangeClients(value)}
                    >
                        {products.map(product => {
                            return (
                                <Checkbox key={product.id} value={product.id?.toString()}>{product.productcode}</Checkbox>
                            )
                        })}

                    </CheckboxGroup>
                </div>
                <div className='mt-4'>
                    <button onClick={() => handleCreateClient()} className='bg-sky-600 text-white px-3 py-1 rounded'>Create  Client</button>
                </div>
            </div>
        </div>
    )
}

export default CreateClientPage
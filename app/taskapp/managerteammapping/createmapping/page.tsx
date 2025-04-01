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

interface IProduct {
    id?: number;
    productcode?: string;
    productname: string;
}


interface IUser {
    id: number;
    fullname?: string;
    username?: string;
    role?: string;
}

interface IManagerUserMapping {
    productid: number;
    managerid: number;
    userlist: string[] | FormEvent<HTMLDivElement>
}

function CreateClientPage() {
    const router = useRouter();


    const [products, setProducts] = useState<IProduct[]>([])
    const [usersRole, setUsersRole] = useState<IUser[]>([])
    const [managersRole, setManagersRole] = useState<IUser[]>([])
    const [managerusermappingState, setManagerusermappingState] = useState<IManagerUserMapping>({
        managerid: 0,
        productid: 0,
        userlist: []
    })

    const handleCreateMapping = async () => {
        try {
            const body = {
                productid: managerusermappingState.productid,
                managerid: managerusermappingState.managerid,
                userlist: managerusermappingState.userlist
            }

            console.log(body);

            const endpoint = `${apiUrl}/api/managerusermapping/createmanagerusermapping`
            const { data } = await axiosinstance.post(endpoint, body)
            if (data.success) {
                window.alert(data.message)
                return router.push("/taskapp/managerteammapping")
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
                    if (data.data.length > 0) {
                        setManagerusermappingState((prevState) => ({
                            ...prevState,
                            productid: data.data[0].id
                        }));

                    }
                }
            } catch (err) {
                console.log("Error in getAllProjects API", err)
            }
        }
        getAllProducts();
    }, [])


    useEffect(() => {
        async function getAllUsersForManager() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallusersbyrole/manager`)
                if (data.success) {
                    setManagersRole(data.data)
                    if (data.data.length > 0) {
                        setManagerusermappingState((prevState) => ({
                            ...prevState,
                            managerid: data.data[0].id
                        }));

                    }
                }
            } catch (err) {
                console.log("Error in getAllUsersForManager API", err)
            }
        }
        getAllUsersForManager();
    }, [])

    useEffect(() => {
        async function getAllUsersForUser() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallusersbyrole/user`)
                if (data.success) {
                    setUsersRole(data.data)
                   
                }
            } catch (err) {
                console.log("Error in getAllUsersForUser API", err)
            }
        }
        getAllUsersForUser();
    }, [])

    const handleOnChangeUsers = (value: string[] | FormEvent<HTMLDivElement>) => {
        setManagerusermappingState({ ...managerusermappingState, userlist: value })
    }

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
                    <BreadcrumbItem onClick={() => router.push("/taskapp/managerteammapping")}>Team Mapping</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/managerteammapping/createmapping")} >Create Team Mapping</BreadcrumbItem>
                </Breadcrumbs>
                <h2 className='font-bold text-xl mt-4'>Create Manager Team Mapping</h2>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Select Manager: </label>
                    <select className='mt-4 border border-slate-400 outline-none px-2 py-1 w-full' onChange={(e) => {
                        setManagerusermappingState((prevState) => ({
                            ...prevState,
                            managerid: Number(e.target.value)
                        }));
                        // setManagerusermappingState({ ...managerusermappingState, managerid: Number(e.target.value) })
                    }
                    }>
                        {managersRole.map(m => {
                            return (
                                <option key={m.id} value={m.id} >{m.fullname}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='flex flex-col mt-4'>
                    <label className='font-bold'>Select Product: </label>
                    <select onChange={(e) => {
                        setManagerusermappingState((prevState) => ({
                            ...prevState,
                            productid: Number(e.target.value)
                        }));
                        // setManagerusermappingState({ ...managerusermappingState, productid: Number(e.target.value) })
                    }} className='outline-none border border-slate-400 px-2 py-1 rounded mt-3'>
                        {products.map(product => {
                            return (
                                <option key={product.id} value={product.id}>{product.productcode}</option>
                            )
                        })}
                    </select>
                </div>

                <div className='flex flex-col mt-4'>
                    <CheckboxGroup
                        label="Select Team Members"
                        orientation="horizontal"
                        color="default"
                        onChange={(value) => handleOnChangeUsers(value)}
                    >
                        {usersRole.map((user, index) => {
                            return (
                                <Checkbox key={index} value={user.id?.toString()}>{user.fullname}</Checkbox>
                            )
                        })}

                    </CheckboxGroup>
                </div>
                <div className='mt-4'>
                    <button onClick={handleCreateMapping} className='bg-red-500 text-white px-3 py-1 rounded'>Create Team Mapping</button>
                </div>
            </div>
        </div>
    )
}

export default CreateClientPage
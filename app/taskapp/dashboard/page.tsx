'use client'
import { apiUrl } from '@/config';
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { axiosinstance } from '../../libs/axiosinstance';
import { Breadcrumbs, BreadcrumbItem, Spinner } from "@nextui-org/react";
// import { Select, SelectItem } from "@nextui-org/react";
import { Badge, Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Select from 'react-select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell } from 'recharts';
import BargraphComponent from '@/app/components/BargraphComponent';

interface IProject {
    id: number;
    projectname: string;
    projectdescription: string;
}

interface Task {
    id: number;
    taskname: string | null;
    priority: string;
    status: string;
    assigneeuser: string;
    assigneeuserid: number;
    productname: string;
    productid: number;
    projectlead: string;
    projectleaduserid: number;
}

interface Counts {
    [key: string]: number;
}

interface TaskDashboardProps {
    data: Task[];
}

interface IStatus {
    label?: string;
    value?: string;
}

const status: IStatus[] = [
    { value: "Open", label: "Open" },
    { value: "Close", label: "Close" },
    { value: "In Progress", label: "In Progress" },
    { value: "Hold", label: "Hold" },

]

interface IFilter {
    status: readonly IStatus[],
}


function DashboardPage() {
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState<any>()
    const [totalTask, setTotalTask] = useState<any>()
    const [productData, setProductData] = useState<any>()
    const [groupSelected, setGroupSelected] = useState<any>([]);
    const [pieColor, setPieColor] = useState<any>()
    const [filters, setFilters] = useState<IFilter>({
        status: [],
    });




    useEffect(() => {
        async function getAllProjects() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/dashboard`)
                if (data.success) {
                    // setTimeout(() => { setDashboardData(data.data) }, 1500)
                    setDashboardData(data.data)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllProjects();
    }, [])

    useEffect(() => {
        let totalCount = 0;

        if (dashboardData) {
            dashboardData.forEach((item: any) => {
                totalCount += item.count;
            });
        }

        setTotalTask(totalCount)


    }, [dashboardData])




    const fetchHandler = async () => {
        try {
            let newFilters = {

                status: filters.status.map((f: any) => f.value),

            }

            let { data } = await axiosinstance.get(`${apiUrl}/api/task/taskdashboarddata`, { params: newFilters })
            if (data.success) {
                setProductData(data.data)
            }
        } catch (error) {
            console.log("Error in getDashboard data API", error)
        }


    }

    useEffect(() => {
        const getProductCount = async () => {
            try {
                let newFilters = {

                    status: filters.status.map(f => f.value)

                }

                let { data } = await axiosinstance.get(`${apiUrl}/api/task/taskdashboarddata`, { params: newFilters })
                if (data.success) {
                    //setTimeout(() => { setProductData(data.data) }, 2000)

                    setProductData(data.data)

                }
            } catch (error) {
                console.log("Error in getDashboard data API", error)
            }

        }

        getProductCount()
    }, [])


    let arr: any[] = []
    if (productData) {
        productData.map((obj: any) => {
            Object.keys(obj).forEach((key) => {
                if (key !== "name" && !arr.includes(key)) {
                    arr.push(key)
                }
            })

        })
    }




    const generateColors = () => {
        const colors = [];
        for (let i = 0; i < arr.length; i++) {
            // Generate random color codes
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            colors.push(color);
        }
        return colors;
    };

    // State to store dynamically generated colors
    const [colors, setColors] = useState(generateColors());
    const [pieColors, setPieColors] = useState(generateColors());

    // Function to update colors

    useEffect(() => { setPieColors(generateColors()) }, [dashboardData])
    useEffect(() => {
        setColors(generateColors());


    }, [productData])






    const RADIAN = Math.PI / 180;

    const getPer = ({ cx, cy, midAngle, innerRadius, outerRadius, payload, percent, index }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        let dt = `${(percent * 100).toFixed(0)}% `
        return dt

    }


    return (
        <div className='flex flex-col p-4'>
            <div className='mb-4'>
                <Breadcrumbs classNames={{
                    list: "bg-slate-600",
                }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/dashboard")}>Dashboard</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className="pt-2  w-[200] h-[40] border bg-white rounded-lg " style={{ width: "200px", height: "50px", textAlign: 'center' }}><h6 className='pt-1'>Total Task : {totalTask}</h6></div>

            <div className='flex flex-row gap-3'>

                <div style={{ width: "600px", height: "500px", marginRight: "100px" }}>
                    {!dashboardData && (<Spinner className='flex items-center justify-center h-full' />)}

                    {dashboardData &&
                        (
                            <ResponsiveContainer width="100%" height="100%" className='pt-0'>
                                <PieChart width={4000} height={400}>

                                    <Pie style={{ marginTop: "2px" }}

                                        data={dashboardData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        // label={renderCustomizedLabel}
                                        outerRadius={180}
                                        innerRadius={0}
                                        fill="#900C3F"
                                        // fill ={COLORS.map((x) => x )}
                                        dataKey="count"
                                        nameKey="STATUS"
                                        label={getPer}>
                                        {dashboardData?.map((entry: any, index: any) => (

                                            <Cell fill={pieColors[index % pieColors.length]} key={index} />
                                        ))}

                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" className='m-2' />
                                </PieChart>
                            </ResponsiveContainer>
                        )}



                </div>

                <div style={{ width: "900px", height: "500px" }}>

                    {!productData && (<Spinner className='flex items-center justify-center h-full' />)}

                    {productData && (
                        <>
                            <div className="flex gap-3" style={{ marginLeft: "95px" }}>

                                <Select
                                    options={status}
                                    isMulti
                                    value={filters.status}
                                    onChange={(value) => {
                                        setFilters({ ...filters, status: value })
                                    }}
                                />

                                <Button radius="full" onClick={fetchHandler}>
                                    Fetch Data
                                </Button>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart
                                    layout="vertical"
                                    width={500}
                                    height={300}
                                    data={productData}
                                    margin={{
                                        top: 20,
                                        right: 10,
                                        left: 40,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    {/* <Legend /> */}
                                    {arr?.map((user: any, index: any) => (
                                        <Bar key={index} dataKey={user} stackId="a" fill={colors[index]} />
                                    ))}
                                </ComposedChart>
                            </ResponsiveContainer></>

                    )}




                </div>
            </div>

        </div>
    )
}


export default DashboardPage
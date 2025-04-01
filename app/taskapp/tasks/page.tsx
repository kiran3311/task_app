'use client'
import { apiUrl } from '@/config';
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { axiosinstance } from '../../libs/axiosinstance';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination, Tooltip } from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem, Input } from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";
import moment from 'moment';
import { IoIosSearch } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast } from 'react-toastify';
import Tooltipcomponent from '../../components/Tooltipcomponent';
import { Progress } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import Select from 'react-select';
import { FaSearch } from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";

interface ProductSort {
    id: number;
    productname: string;
  }
//import { Pagination } from 'carbon-components-react'
interface IProductFilter {
    label: string;
    value: string;
}
type ProjectType = {
    id: number;
    projectname: string;
}
interface IClient {
    id: number;
    clientname: string;
}

type IProduct = {
    id: number;
    productname: string;
}
interface ITask {
    id: number;
    taskname: string;
    remarkforinnerhtml: string;
    status: string;
    project: ProjectType;
    client: IClient;
    priority: string;
    product: IProduct;
    assignstartdate: Date;
    assigneeuser: IUser;
    percentage: number | string;
    [key: string]: any;
}
interface IUser {
    fullname?: string;
    role?: string;
    id?: number;
    username?: string;
}
interface ITaskDesc {
    id?: number;
    taskdesc: string;
}

interface IFilters {
    products: readonly IProductFilter[],

}



const TasksPage: React.FC = () => {
    const router = useRouter();
    const [taskList, setTasksList] = useState<ITask[]>([])
    const [taskListCopy, setTasksListCopy] = useState<ITask[]>([])
    const [statusFilterTaskList, setStatusFilterTaskList] = useState<ITask[]>([])
    const [productWiseTask, setProductWiseTask] = useState<any>([])

    const [user, setUser] = useState<IUser>({
        fullname: "",
        role: "user",
        id: 0,
        username: ""
    })

    const [searchQuery, setSearchQuery] = useState<string>();
    const [searchList, setSearchList] = useState()
    const [taskPageNo, setTaskPageNo] = useState(1)
    const [statusList, setStatusList] = useState<any>([])
    const [statusFilter, setStatusFilter] = useState<string>("All")
    // const [productList ,setProductList] = useState<any>([]);
    const [filterProduct, setFilterproduct] = useState<any>([])
    const [productsList, setProductsList] = useState<IProductFilter[]>([{ value: "all", label: "All" }]);
    const [filters, setFilters] = useState<IFilters>({
        products: [],
    });

    const [productFilterTask, setProductFilterTask] = useState<ITask[]>([])


    const rowsPerPage = 30;

    const summaryPages = Math.ceil(taskList.length / rowsPerPage);

    const summaryItems = React.useMemo(() => {
        const start = (taskPageNo - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return taskList.slice(start, end);
    }, [taskPageNo, taskList]);


    useEffect(() => {
        async function jwtDecodeMethod() {
            try {
                const token = await localStorage.getItem('token')
                if (token) {
                    const decoded: any = jwtDecode(token)
                    setUser(decoded)
                }
            } catch (err) {
                console.log(err)
            }
        }
        jwtDecodeMethod()
    }, [])

    //Get products
    useEffect(() => {
        async function getAllProducts() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/product/getallproductsfortask`)
                if (data.success) {
                    //setProductList(data.data)
                    setProductsList(data.data)

                }
            } catch (err) {
                console.log("Error in getAllProducts API", err)
            }
        }
        getAllProducts();
    }, []);


    const fetchData = async () => {
        try {

            let newFilters = {
                products: filters.products.map(f => f.value),

            }

            if(filters.products.length == 0){ setStatusFilter("All")}


            const { data } = await axiosinstance.get(`${apiUrl}/api/task/taskreportsbyproduct`, { params: newFilters });
            if (data.success) {
                setTasksList(data.data)
                setTasksListCopy(data.data)
                setStatusFilterTaskList(data.data)
                setProductWiseTask(data.data)
                setTaskPageNo(1)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {

        fetchData()
       // console.log("Entered into rendered.....")
        setStatusFilter("All")


    }, [filters.products])

  
 

    useEffect(() => {
        let arr: any = []

        // productsList.forEach((prod: any) => {
        //     if (!arr.includes(prod)) {
        //         let obj = { value: prod.id, label: prod.productcode }

        //         arr.push(obj)
        //     }


        // });

        const products = productFilterTask.map((a=>a.product))
        const prodlist = [...products]
        // prodlist.forEach((prod:any)=>{
        //     if (!arr.includes(prod)) {
        //         let obj = { value: prod.id, label: prod.productname }

        //         arr.push(obj)
        //     }
        // })

       

        const uniqueArray: ProductSort[] = prodlist.reduce((acc: ProductSort[], current: ProductSort) => {
            const exists = acc.some(item => item.id === current.id && item.productname === current.productname);
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, []);

          const productFilters: IProductFilter[] = uniqueArray.map(product => ({
            label: product.productname,
            value: product.id.toString()
          }));


        setFilterproduct(productFilters)

    }, [taskList])

    // console.log("data------>", filterProduct)
    // console.log("productListData------", productsList)
    // console.log("After selection-", filters)
    // console.log("taskList", taskList)
    // console.log("taskListCopy", taskListCopy)
    // console.log("statusFilterTaskList", statusFilterTaskList)
    // console.log("data after filtered", productWiseTask)
   // console.log("data---->>", filters.products)


    useEffect(() => {
        async function getAlltask() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getalltask`)
                if (data.success) {

                    setTasksList(data.data)
                    setTasksListCopy(data.data)
                    setStatusFilterTaskList(data.data)
                    setProductFilterTask(data.data)


                }
            } catch (err) {
                console.log("Error in getAlltask API", err)
            }
        }
        getAlltask();
    }, [searchList])

    useEffect(() => {
        let statusLi: any = []
        statusLi.push("All")
        statusFilterTaskList.map((task) => {
            if (!statusLi.includes(task.status)) {
                statusLi.push(task.status)

            }
        })

        setStatusList([...statusLi])

    }, [taskList])


    const onchangeSerchHandler = (event: any) => {
        setSearchQuery(event.target.value)
        filtered(event.target.value)
        setTaskPageNo(1)
        //setStatusFilter("")

    }

    const statusRadioHandeler = (event: any) => {
        setStatusFilter(event.target.value)
        statusRadioFilter(event.target.value)
        setSearchQuery("")
        setTaskPageNo(1)
    }

    interface ITask {
        id: number;
        taskname: string;
        remarkforinnerhtml: string;
        status: string;
        project: ProjectType;
        client: IClient;
        priority: string;
        product: IProduct;
        assignstartdate: Date;
        assigneeuser: IUser;
        taskdesc: ITaskDesc;
        percentage: number | string;
        [key: string]: any;
    }

    const compareString = (value: string, searchQuery: string | number) => {
        return value.trim().toLowerCase() === searchQuery;
    }

    console.log("getprodfromtask------==+",taskList.map((a=>a.product)))
    console.log("productlistApiData----", productsList)

    const filtered = (searchQuery: string) => {
        searchQuery = searchQuery.toLowerCase()
        //console.log("SEARCH => ", searchQuery)
        let newTaskArray = [...taskListCopy]
        let newFilteredList = newTaskArray.filter((task) => {
            for (let key in task) {
                const value = task[key];

                if (typeof value === 'string') {
                    if (task.product.productname.trim().toLowerCase().includes(searchQuery)) {
                        return true;
                    } else if (task.client.clientname.trim().toLowerCase().includes(searchQuery)) {
                        return true;
                    } else if (task.project.projectname.trim().toLowerCase().includes(searchQuery)) {
                        return true;
                    } else if (task.priority.trim().toLowerCase().includes(searchQuery)) {
                        return true;
                    } else if (task.status.trim().toLowerCase().includes(searchQuery)) {
                        return true;
                    } else if (task?.assigneeuser?.fullname && task?.assigneeuser?.fullname.trim().toLowerCase().includes(searchQuery)) {
                        return true;
                    }
                    else if (task?.taskdesc?.taskdesc.trim().toLowerCase().includes(searchQuery)) {
                        return true;
                    }
                    else if (task?.id.toString().includes(searchQuery)) {
                        return true
                    }


                }
            }
            return false
        })


        setTasksList(newFilteredList)
    }


    const statusRadioFilter = (status: string) => {
        // if (status === "All") {
        //     fetchAllTask();
        //     return true
        // }
        let newTaskArray = [...statusFilterTaskList]

        let filterStatus = newTaskArray.filter((task) => {
            for (let key in task) {
                const value = task[key]
                if (typeof value === "string") {
                    if (task.status == status) {
                        return true
                    }
                    if (task.status !== status && status === "All")
                        return true


                }
            }

            return false
        })


        setTasksList(filterStatus)
        setTasksListCopy(filterStatus)
    }

    const setRadioColor = (status: any): "success" | "danger" | "secondary" | "warning" | "default" | "primary" | undefined => {
        let color: string | undefined = undefined;

        if (status === "Close") {
            color = "success";
        } else if (status === "Open") {
            color = "danger";
        } else if (status === "In Progress") {
            color = "secondary";
        } else if (status === "Hold") {
            color = "warning";
        }

        return color as "success" | "danger" | "secondary" | "warning" | "default" | "primary" | undefined;
    };



    const setTextColor = (status: any) => {
        let color;
        if (status == "Close") {
            color = "#17c964"
        }
        else if (status == "Open") {
            color = "#f31260"
        }
        else if (status == "In Progress") {
            color = "#9353d3"
        }
        else if (status == "Hold") {
            color = "#f5a524"
        }
        return color
    }




    const deleteTask = async (taskid: any, assignedUser: any) => {
        const result = window.confirm(`Are you sure you want to Delete Task assigned to ${assignedUser} ?`)
        if (result) {
            try {
                const endpoint = `${apiUrl}/api/task/deletetaskbyid/${taskid}`
                const { data } = await axiosinstance.delete(endpoint)
                if (data.success) {
                    window.alert(`Succesfully ${data.message}`)
                    toast.success("Task Deleted Succesfully", {position: "bottom-right", autoClose: 1000 })
                    setSearchList(data.data)
                    setSearchQuery("")
                    setStatusFilter("")


                    // return router.push("/taskapp/projects")
                }                                     
            } catch (error: any) {
                console.log(error)
            }

        }
        else {
            return router.push(`/taskapp/tasks/`)
        }

    }


    // http://192.168.100.183:3000/login
    //console.log("get all Tast--", taskList)
    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row  justify-between w-full mt-5'>
                <Breadcrumbs classNames={{
                    list: "bg-slate-600",
                }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/tasks")}>Tasks</BreadcrumbItem>

                </Breadcrumbs>
                <div className='flex gap-2'>
                    <Select
                        placeholder={'Select Products'}
                        options={filterProduct}
                        isMulti
                        value={filters.products}
                        onChange={(value) => {
                            setFilters({ ...filters, products: value })

                        }}
                    />


                    {/* <Button isIconOnly className=' inline-flex text-center ' variant="faded" onClick={() => { fetchData() }}>
                        <Tooltip content="Refresh" color='default' closeDelay={100}>
                            
                            <span> <TfiReload className=' text-xl' /></span>
                        </Tooltip>
                    </Button> */}


                </div>



                <RadioGroup

                    orientation="horizontal"
                    className='mt-2'
                    size='md'
                    onChange={(e) => statusRadioHandeler(e)}
                    value={statusFilter}
                >

                    {statusList.map((status: any) => {
                        const color = setRadioColor(status)
                        return (
                            <Radio key={status} color={color} value={status} className='font-bold' >{status}</Radio>
                        )
                    })}
                    {/* <Radio color='danger' value="open">Open</Radio>
                    <Radio color='success' value="close">Close</Radio>
                    <Radio color='secondary' value="in progress">In progress</Radio>
                    <Radio color='warning' value="hold">Hold</Radio> */}

                </RadioGroup>

                <Input className='w-[200] border border-slate-400 rounded-md'
                    value={searchQuery}

                    onChange={(e) => onchangeSerchHandler(e)}
                    label=""
                    placeholder=""
                    labelPlacement="outside"
                    startContent={
                        <IoIosSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                />
                {(user?.role === "admin" || user?.role === "manager" || user?.role === "support") &&
                    <Button onClick={() => router.push("/taskapp/tasks/createtask")} className='bg-sky-600 text-white px-3 py-1 rounded font-semibold'>Create Task</Button>
                }
            </div>
            <div className='flex flex-row justify-center mt-4 '>


                <Table
                    isHeaderSticky  
                    isStriped aria-label="Example static collection table"
                    className="border border-sky-600 rounded-xl mb-4 w-full overflow-auto max-h-screen"
                   // className="border border-sky-600 rounded-xl mb-4"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={taskPageNo}
                                total={summaryPages}
                                onChange={(page) => setTaskPageNo(page)}
                            />
                        </div>
                    }>
                    <TableHeader  >

                        <TableColumn className='bg-sky-100 text-sm ' >Sr No.</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Task Id</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Product</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Project name</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Client name</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Task Desc</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Priority</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Status</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Duration</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Assignee</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm '>Progress</TableColumn>
                        <TableColumn className='bg-sky-100 text-sm text-center'>Action</TableColumn>

                    </TableHeader>





                    <TableBody >

                        {summaryItems.map((task, index) => {
                            //console.log(taskList)
                            //style={{ backgroundColor: setRowColor(task.status), border:"1px solid black", borderCollapse:"separate", borderSpacing:"20 px" }}
                            return (
                                <TableRow key={task.id}  >
                                    { }
                                    <TableCell className=''>{((taskPageNo - 1) * rowsPerPage) + index + 1}</TableCell>

                                    <TableCell className='cursor-pointer ' >
                                        <Tooltipcomponent text={task?.remarkforinnerhtml} >
                                            <span> {task?.id} </span>
                                        </Tooltipcomponent>
                                    </TableCell>

                                    {/* <TableCell className='cursor-pointer' >
                                        {task?.id}
                                    </TableCell> */}

                                    <TableCell >{task?.product?.productname}</TableCell>
                                    <TableCell >{task?.project?.projectname}</TableCell>
                                    <TableCell >{task?.client?.clientname}</TableCell>
                                    <TableCell >{task?.taskdesc?.taskdesc}</TableCell>
                                    <TableCell >{task.priority}</TableCell>
                                    <TableCell style={{ color: setTextColor(task?.status) }}>{task.status}</TableCell>
                                    <TableCell >{moment(task.assignstartdate).fromNow()}</TableCell>
                                    <TableCell >{task.assigneeuser.fullname}</TableCell>
                                    <TableCell className='text-center'><Progress
                                        size="md"
                                        radius="md"
                                        color="success"
                                        label=""
                                        value={Number(task?.percentage)}
                                        showValueLabel={true}
                                        key={task.id}
                                    /></TableCell>
                                    <TableCell className='text-center'>
                                        {/* <Link href={`/taskapp/tasks/${task.id}`} className='px-2  inline-flex text-center' >
                                            <Tooltip content="View" color='warning' closeDelay={100}>
                                                <span> <FaEye className='text-orange-600 text-xl' /></span>
                                            </Tooltip>
                                        </Link> */}

                                        <Button isIconOnly className=' inline-flex text-center'
                                            href={`/taskapp/tasks/${task.id}`}
                                            as={Link}
                                            variant="faded"
                                            color="warning"
                                        >
                                            <Tooltip content="View" color='warning' closeDelay={100}>
                                                <span> <FaEye className='text-orange-600 text-xl' /></span>
                                            </Tooltip>

                                        </Button>


                                        {/* <Link href={`/taskapp/tasks/${task.id}/edittask`}   className='bg-red-500 text-white px-3 py-1 rounded ml-2' >
                                            Edit percentage
                                        </Link>   */}
                                        {
                                            (user.role === "admin" || user.role === "manager") && (
                                                // <Link href={`/taskapp/tasks/${task.id}/edit`} className='px-2  inline-flex text-center' >
                                                //     <Tooltip content="Edit" color='primary' closeDelay={100}>
                                                //         <span><MdEdit className='text-blue-800 text-xl' /></span>
                                                //     </Tooltip>
                                                // </Link>
                                                <Button isIconOnly className='m-1 inline-flex text-center'
                                                    href={`/taskapp/tasks/${task.id}/edit`}
                                                    as={Link}
                                                    color="primary"
                                                    variant="faded">
                                                    <Tooltip content="Edit" color='primary' closeDelay={100}>
                                                        <span><MdEdit className='text-blue-800 text-xl' /></span>
                                                    </Tooltip>

                                                </Button>
                                            )}
                                        {
                                            (user.role === "admin" || user.role === "manager") && (
                                                <Button isIconOnly className=' inline-flex text-center ' variant="faded" color="danger" onClick={() => { deleteTask(task.id, task?.assigneeuser?.fullname) }}>
                                                    <Tooltip content="Delete" color='danger' closeDelay={100}>
                                                        <span> <MdDelete className='text-red-700 text-xl' /></span>
                                                    </Tooltip>
                                                </Button>
                                            )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}


                    </TableBody>
                </Table>







            </div>
        </div>
    )
}

export default TasksPage
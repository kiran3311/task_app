'use client'
import React, { useState, useEffect } from 'react'
import { apiUrl } from '@/config';
import TaskComponent from '@/app/components/TaskComponent';
import { axiosinstance } from '@/app/libs/axiosinstance';
import ButtonDropdown from '@/app/components/ButtonDropdown';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { ITask } from '../[taskid]/edit/page';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { IoAddCircle } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
// import DateTimePicker from 'react-datetime-picker';
import { TiPlus } from "react-icons/ti";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdDone } from "react-icons/md";
import { Tooltip } from "@nextui-org/react";
import { Button } from "@nextui-org/react";


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
type Key = string | number;
export type IKeyValue = {
    [K in Key]: string;
};

// export interface ITask {
//     id?: string;
//     taskname?: string;
//     remarkforinnerhtml?: string;
//     remarkforeditting?: string;
//     tasktype?: string;
//     priority?: string;
//     actualstartdate: string | (readonly string[] & string) | undefined;
//     duedate: string | (readonly string[] & string) | undefined;
//     completiondate: string | (readonly string[] & string) | undefined;
//     status?: string;
//     billingtype?: string;
//     approvalstatus?: string;
//     clientid?: number;
//     projectid?: number;
//     projectleaduserid?: number;
//     assigneeuserid?: number;
//     teamleaduserid?: number;
//     flag?: string;
//     taskdescriptionid?: number;
//     moduleid?: Number;
// }


export interface IMainTaskDetails {
    productid?: number;
    tasktype?: string;
    clientid?: number;
    projectid?: number;
    taskdescriptionid?: number;
    billingtype?: string;
}


interface IProduct {
    id?: number;
    productcode?: string;
    productname?: string;
}

interface IProject {
    id: number;
    projectname: string;
    projectdescription: string;
}
interface IClient {
    id: number;
    clientname: string;
    clientdetails: string;
}

interface ITaskDescription {
    id: number;
    taskdescription: string;
    tasktype?: string;
}

interface IModule {
    id: number;
    modulename: string;
    moduledescription: string;
    weightage: string;
    project: IProject;
}


interface IUser {
    fullname: string;
    role: string;
    id: number;
    username: string;
}



const TasksPage = () => {
    const router = useRouter();
    const [value, onChange] = useState<Value>(new Date());

    const [isAddTask, setIsAddtask] = useState<Boolean>(false)


    const [mainTaskDetails, setMainTaskDetails] = useState<IMainTaskDetails>({
        productid: 0,
        clientid: 0,
        projectid: 0,
        taskdescriptionid: 0,
        billingtype: "",
        tasktype: ""
    })


    let defaultDate = new Date();
    // Set hours to 19 for 7:00 PM (JavaScript counts hours from 0 to 23)
    defaultDate.setHours(19);
    defaultDate.setMinutes(0);
    defaultDate.setSeconds(0);

    const [tasks, setTasks] = useState<ITask[]>([{
        id: new Date().toLocaleString(),
        taskname: "",
        priority: "",
        actualstartdate: undefined,
        duedate: defaultDate,
        completiondate: undefined,
        status: "Open",
        billingtype: "",
        approvalstatus: "",
        clientid: 0,
        projectid: 0,
        taskdescriptionid: 0,
        projectleaduserid: 0,
        assigneeuserid: 0,
        remarkforinnerhtml: "",
        remarkforeditting: "",
        flag: "",
        moduleid: 0,
        comments: [],
        assignstartdate: new Date()
    }]);


    const [projectIdErr, setProjectIdErr] = useState(false)

    const [submitLoader, setSubmitLoader] = useState<any>(false)


    const [copytask, setcopyTask] = useState<ITask>({
        id: 0,
        taskname: "",
        priority: "",
        actualstartdate: "",
        duedate: "",
        completiondate: "",
        assignstartdate: "",
        status: "",
        billingtype: "",
        approvalstatus: "",
        clientname: "",
        projectname: "",
        remarkforinnerhtml: "",
        remarkforeditting: "",
        flag: "",
        assigneeuser: "",
        modulename: "",
        productname: "",
        projectlead: "",
        taskdescriptionname: "",
        tasktype: "",
        teamleaduser: "",
        comments: [],
        productid: 0,
        moduleid: 0,
        projectid: 0,
        projectleaduserid: 0,
        assigneeuserid: 0,
        timetocompletetask: "",
        taskdescriptionid: 0,
        percentage: 0,
    });

    const [productList, setProductList] = useState<IProduct[]>([])

    const [user, setUser] = useState<IUser>({
        fullname: "",
        role: "user",
        id: 0,
        username: ""
    })

    const [isRequiredError, setIsRequiredError] = useState<boolean>(true)

    const [isValidCommentSatrtDate, setIsValidCommentStartDate] = useState<any>(true)
    const [isValidCommentEndDate, setIsValidCommentEndDate] = useState<any>(true)
    const [invalidTextErr, setInvalidTextErr] = useState<any>(false)
    const [addArray, setAddArray] = useState<any>([])

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

    const formatDataForProductDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, productname }: { id: number, productname: string }) => {
            acc[id] = productname;
            return acc;
        }, {} as any);
        return user
    }

    useEffect(() => {
        async function getAllProducts() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/product/getallproductsfortask`)
                if (data.success) {
                    setProductList(data.data)

                }
            } catch (err) {
                console.log("Error in getAllProducts API", err)
            }
        }
        getAllProducts();
    }, []);

    const [moduleaObj, setModulesObj] = useState<any>([])

    useEffect(() => {
        async function getAllModules() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/module/getallmodules`)
                if (data.success) {
                    const modules: IKeyValue = formatDataForModuleDropdown(data.data)
                    //setModulesObj(modules)
                    setModulesObj(data.data)
                }
            } catch (err) {
                console.log("Error in getAllModules API", err)
            }
        }
        getAllModules();
    }, [])




    const handleUpdateItem = (taskid: string, name: string, value: any) => {

        if (taskid) {
            if (name === "assignstartdate") {
                setIsValidCommentStartDate(value && value.isValid && value.isValid())
            }

            if (name === "duedate") {
                setIsValidCommentEndDate(value && value.isValid && value.isValid())
            }




            let newValue: string | number | Date = value
            // if (name === "actualstartdate" || name === "duedate" || name === "completiondate") {
            //     console.log("Comming")
            //     const dt = value + ':00Z';
            //     newValue = dt
            // }

            if (name === "projectleaduserid" || name === "assigneeuserid") {
                newValue = Number(value)
            }
            const updatedItems = tasks.map((task) => {
                if (task.id === taskid) {

                    return { ...task, [name]: newValue }
                } else {
                    return task
                }
            })
            setTasks(updatedItems)
            //setcopyTask(updatedItems)

            // setcopyTask(updatedItems)
            setcopyTask({ ...copytask, [name]: newValue })


        } else {
            let newValue: string | number | Date = value
            if (name === "taskdescriptionid") {
                newValue = Number(value)
            }
            if (name === "productid") {
                getAllProjects(value)
                getAllClients(value)
            }
            if (name === "tasktype") {
                getAllDescriptionbyTaskType(value)
            }

            setMainTaskDetails({ ...mainTaskDetails, [name]: newValue })
            // let existingList = {...mainTaskDetails}
            //setcopyTask({ ...copytask, [name]: newValue })


        }
    }



    const formatDataForModuleDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, modulename }: { id: number, modulename: string }) => {
            acc[id] = modulename;
            return acc;
        }, {} as any);
        return user
    }



    const formatDataForProjectDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, projectname }: { id: number, projectname: string }) => {
            acc[id] = projectname;
            return acc;
        }, {} as any);
        return user
    }




    const [projectList, setProjectList] = useState<IProject[]>([])
    async function getAllProjects(value: any) {

        const productid = Number(value)
        try {
            let { data } = await axiosinstance.get(`${apiUrl}/api/task/getprojectsbyproductid/${productid}`)
            if (data.success) {
                setProjectList(data.data)
            }
        } catch (err) {
            console.log("Error in getallusers API", err)
        }
    }



    const formatDataForClientDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, clientname }: { id: number, clientname: string }) => {
            acc[id] = clientname;
            return acc;
        }, {} as any);
        return user
    }

    const [clientList, setClientList] = useState<IClient[]>([])

    async function getAllClients(value: string | number) {
        try {
            const productid = Number(value)
            let { data } = await axiosinstance.get(`${apiUrl}/api/client/getclientbyproductid/${productid}`)
            if (data.success) {
                setClientList(data.data)
            }
        } catch (err) {
            console.log("Error in getAllClients API", err)
        }
    }

    // const billingType: any = {
    //     Billable: "Billable",
    //     ["Non Billable"]: "Non Billable"
    // }


    const billingType: { key: string, value: string }[] = [
        { key: "Billable", value: "Billable" },
        { key: "Non Billable", value: "Non Billable" },
    ]

    // const handleTaskSubmit = async () => {


    //     const result = window.confirm(`Are you sure you want to Submit Task ?`)
    //     if (result) {

    //         try {
    //             if (!mainTaskDetails.productid
    //                 || !mainTaskDetails.clientid
    //                 || !mainTaskDetails.projectid
    //                 || !mainTaskDetails.billingtype
    //                 || !mainTaskDetails.tasktype
    //                 || !mainTaskDetails.taskdescriptionid) {
    //                 setIsRequiredError(true);
    //                 console.log("TT => ", mainTaskDetails.taskdescriptionid)
    //                 return;
    //             }
    //             for (let i = 0; i < tasks.length; i++) {
    //                 let task = tasks[i];

    //                 if (!task.remarkforinnerhtml
    //                     || !task.priority

    //                     || !task.projectleaduserid
    //                     || !task.status
    //                     || ((typeof task.assignstartdate === 'string' && task.assignstartdate.length <= 0)
    //                         || (task.assignstartdate instanceof Date && task.assignstartdate && task.assignstartdate.getTime() <= 0))
    //                     || (task.assignstartdate === null || task.assignstartdate === undefined || task.assignstartdate === '')
    //                     || ((typeof task.duedate === 'string' && task.duedate.length <= 0)
    //                         || (task.duedate instanceof Date && task.duedate && task.duedate.getTime() <= 0))
    //                     || (task.duedate === null || task.duedate === undefined || task.duedate === '')
    //                 ) {
    //                     setIsRequiredError(true)
    //                     return;
    //                 }

    //                 if (!isValidCommentSatrtDate || !isValidCommentEndDate) {
    //                     // window.alert("invalid dates")
    //                     setInvalidTextErr(true)
    //                     return false;
    //                 }


    //             }
    //             setIsRequiredError(false)
    //             let newBody = {
    //                 tasks,
    //                 mainTaskDetails
    //             }
    //             const endpoint = `${apiUrl}/api/task/createtask`
    //             const { data } = await axiosinstance.post(endpoint, newBody)
    //             if (data.success) {

    //                 window.alert(data.message)
    //                 toast.success(data.message, { autoClose: 500 })
    //                 setIsAddtask(true)

    //                 return router.push("/taskapp/tasks")
    //                 // return router.push("/taskapp/projects")
    //             }
    //         } catch (error: any) {
    //             console.log(error)
    //         }

    //     }


    // }

    const handleTaskSubmit = async () => {

        setSubmitLoader(true)

        const result = window.confirm(`Are you sure you want to Submit Task ?`)
        if (result) {

            try {
                if (!mainTaskDetails.productid
                    || !mainTaskDetails.clientid
                    || !mainTaskDetails.projectid
                    || !mainTaskDetails.billingtype
                    || !mainTaskDetails.tasktype
                    || !mainTaskDetails.taskdescriptionid) {
                    setIsRequiredError(true);
                   // window.alert("Please enter all required fields")
                    toast.warn("Please enter all required fields" , {position: "bottom-right", autoClose: 1000 })
                    setSubmitLoader(false)
                    return;
                }
                for (let i = 0; i < tasks.length; i++) {
                    let task = tasks[i];

                    if (!task.remarkforinnerhtml
                        || !task.priority

                        || !task.projectleaduserid
                        || !task.status
                        || ((typeof task.assignstartdate === 'string' && task.assignstartdate.length <= 0)
                            || (task.assignstartdate instanceof Date && task.assignstartdate && task.assignstartdate.getTime() <= 0))
                        || (task.assignstartdate === null || task.assignstartdate === undefined || task.assignstartdate === '')
                        || ((typeof task.duedate === 'string' && task.duedate.length <= 0)
                            || (task.duedate instanceof Date && task.duedate && task.duedate.getTime() <= 0))
                        || (task.duedate === null || task.duedate === undefined || task.duedate === '')
                    ) {
                        setIsRequiredError(true)
                        toast.warn("Please enter all required fields" , {position: "bottom-right", autoClose: 1000 })
                        setSubmitLoader(false)
                        return;
                    }

                    if (!isValidCommentSatrtDate || !isValidCommentEndDate) {
                        // window.alert("invalid dates")
                        setInvalidTextErr(true)
                        setSubmitLoader(false)
                        return false;
                    }


                }
                setIsRequiredError(false)
                let newBody = {
                    tasks,
                    mainTaskDetails
                }
                const endpoint = `${apiUrl}/api/task/createtask`
                const { data } = await axiosinstance.post(endpoint, newBody)
                if (data.success) {
                    window.alert(data.message)
                    toast.success(data.message, {position: "bottom-right", autoClose: 1000 })
                    setTimeout(() => { setSubmitLoader(false) }, 2000)
                    return router.push("/taskapp/tasks")
                    // return router.push("/taskapp/projects")
                }

                else if(!data.success){
                    window.alert(data.message)
                    return router.push("/taskapp/tasks")
                }
            } catch (error: any) {
                console.log(error)
            }

        }

        else if (!result) {
            setSubmitLoader(false)
        }

    }


    const [tasktypeList, settasktypeList] = useState<{ key: string, value: string }[]>([]);
    useEffect(() => {
        async function gettasktypebyrole() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/taskdescription/gettasktypebyrole`)
                if (data.success) {
                    settasktypeList(data.data)
                    if (data.data.length > 0) {
                        // setMainTaskDetails((prevstate) => ({
                        //     ...prevstate, tasktype: data.data[0].value
                        // }))

                        getAllDescriptionbyTaskType(data.data[0].value)
                    }
                }
            } catch (err) {
                console.log("Error in getAllDescriptionbyTaskType API", err)
            }
        }
        gettasktypebyrole()
    }, [])
    const [taskdescription, setTaskDescription] = useState<ITaskDescription[]>([])
    async function getAllDescriptionbyTaskType(tasktype: string) {
        try {
            let { data } = await axiosinstance.get(`${apiUrl}/api/taskdescription/getalltaskdescriptionbytasktype/${tasktype}`)
            if (data.success) {
                // const taskDescription = formatDataForTaskdescriptionDropdown(data.data)
                // setTaskdescriptionObj(taskDescription)
                setTaskDescription(data.data)
                setMainTaskDetails((prevstate) => ({ ...prevstate, taskdescriptionid: 0 }))
                // if (data.data.length > 0) {
                //     setMainTaskDetails((prevstate) => ({ ...prevstate, taskdescriptionid: data.data[0].id }))
                // }
            }
        } catch (err) {
            console.log("Error in getallusers API", err)
        }
    }


    const addTask = async () => {
        

        const result = window.confirm(`Are you sure you want to Add more Task ?`)
        if (result) {
          

            try {
                if (!mainTaskDetails.productid
                    || !mainTaskDetails.clientid
                    || !mainTaskDetails.projectid
                    || !mainTaskDetails.billingtype
                    || !mainTaskDetails.tasktype
                    || !mainTaskDetails.taskdescriptionid) {
                    setIsRequiredError(true);
                   
                    //console.log("TT => ", mainTaskDetails.taskdescriptionid)
                    return;
                }
                for (let i = 0; i < tasks.length; i++) {
                    let task = tasks[i];

                    if (!task.remarkforinnerhtml
                        || !task.priority

                        || !task.projectleaduserid
                        || !task.status
                        || ((typeof task.assignstartdate === 'string' && task.assignstartdate.length <= 0)
                            || (task.assignstartdate instanceof Date && task.assignstartdate && task.assignstartdate.getTime() <= 0))
                        || (task.assignstartdate === null || task.assignstartdate === undefined || task.assignstartdate === '')
                        || ((typeof task.duedate === 'string' && task.duedate.length <= 0)
                            || (task.duedate instanceof Date && task.duedate && task.duedate.getTime() <= 0))
                        || (task.duedate === null || task.duedate === undefined || task.duedate === '')
                    ) {
                        setIsRequiredError(true)
                       
                        return;
                    }

                    if (!isValidCommentSatrtDate || !isValidCommentEndDate) {
                        // window.alert("invalid dates")
                        setInvalidTextErr(true)
                        return false;
                    }


                }
                setIsRequiredError(false)
                let newBody = {
                    tasks,
                    mainTaskDetails
                }
                const endpoint = `${apiUrl}/api/task/createtask`
                const { data } = await axiosinstance.post(endpoint, newBody)
                if (data.success) {
                    window.alert(data.message)
                    toast.success(data.message, {position: "bottom-right", autoClose: 1000})
                    // console.log("task id===>", data.data[0].ID)
                    let newVal = data.data[0].ID
                    let newArr = [...addArray, newVal]
                    setAddArray([...newArr])
                  //  console.log("task id list--->", addArray)
                    setIsAddtask(true)

                    //return router.push("/taskapp/tasks")
                    // return router.push("/taskapp/projects")
                }
            } catch (error: any) {
                console.log(error)
                window.alert(error)
            }

        }

    }

    const pageClick = async (id: any) => {
        try {
            const { data } = await axiosinstance.get(`${apiUrl}/api/task/gettaskbyid/${Number(id)}`)
            if (data.success) {
                setcopyTask(data.data)

            }
        } catch (err) {
            console.log(err)
        }

    }


    // console.log(copytask)

    const doneClickHandler = () => {
        setIsAddtask(false)
        let noOfTasks = addArray.length
        window.alert(`${noOfTasks} Tasks Created Successfully..`)
        return router.push("/taskapp/tasks")
    }


    const onChangeAssignee = (user: any) => {
        //setcopyTask
        setcopyTask((assigne: any) => ({ ...assigne, assigneeuser: user }))
    }





    return (
        <div className='w-full flex flex-col mb-11'>
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <Breadcrumbs classNames={{
                    list: "bg-slate-600",
                }}
                    itemClasses={{
                        item: "text-white",
                        separator: "text-white",
                    }} variant='solid'>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/tasks")}>Tasks</BreadcrumbItem>
                    <BreadcrumbItem onClick={() => router.push("/taskapp/task/createtask")} >Create Tasks</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='border border-slate-200 flex flex-col mt-4 rounded'>
                <div className='w-full flex flex-row gap-2 mt-4 ml-5 '>
                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>

                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Product Name: </label>
                        {isRequiredError && (!mainTaskDetails || (mainTaskDetails.productid !== undefined && mainTaskDetails.productid <= 0)) && <span className='text-red-500'>*</span>}
                        {/* <ButtonDropdown getAllProjects={getAllProjects} name="productid" handleUpdateItem={handleUpdateItem} labelsMap={productsObj} defaultSelectedValue="" /> */}
                        <select value={isAddTask ? copytask?.productid : mainTaskDetails.productid} onChange={(e) => {
                            const productId = Number(e.target.value)
                            setMainTaskDetails((prevstate) => ({ ...prevstate, productid: productId }))
                            setcopyTask((prevstate) => ({ ...prevstate, productid: productId }))
                            getAllProjects(productId)
                            getAllClients(productId)
                        }} className='rounded border border-slate-400 px-2 py-2 outline-none w-full'>
                            <option className='text-slate-500/50' selected value="">Select Product</option>
                            {productList.map(product => {
                                return (
                                    <option key={product.id} value={product.id}>{product.productcode}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Client Name: </label>
                        {isRequiredError && (!mainTaskDetails || (mainTaskDetails.clientid !== undefined && mainTaskDetails.clientid <= 0)) && <span className='text-red-500'>*</span>}
                        {/* <ButtonDropdown name="clientid" handleUpdateItem={handleUpdateItem} labelsMap={clientsObj} defaultSelectedValue="" /> */}
                        <select value={isAddTask ? copytask.clientid : mainTaskDetails.clientid} onChange={(e) => {
                            const clientid = Number(e.target.value)
                            setMainTaskDetails((prevstate) => ({ ...prevstate, clientid: clientid }))
                            setcopyTask((prevstate) => ({ ...prevstate, clientid: clientid }))

                        }} className='rounded border border-slate-400 px-2 py-2 outline-none w-full'>
                            <option className='text-slate-500/50' selected value="">Select Client</option>
                            {clientList.map(client => {
                                return (
                                    <option key={client.id} value={client.id}>{client.clientname}</option>
                                )
                            })}
                        </select>
                    </div>
                    {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Task Type: </label>
                    <ButtonDropdown name="tasktype" handleUpdateItem={handleUpdateItem} labelsMap={typeMap} defaultSelectedValue="" />
                </div> */}
                </div>

                <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Project Name: </label>
                        {isRequiredError && (!mainTaskDetails || (mainTaskDetails.projectid !== undefined && mainTaskDetails.projectid <= 0) || projectIdErr) && <span className='text-red-500'>*</span>}


                        <select value={isAddTask ? copytask.projectid : mainTaskDetails.projectid} onChange={(e) => {
                            const projectid = Number(e.target.value)
                            setMainTaskDetails((prevstate) => ({ ...prevstate, projectid: projectid }))
                            setcopyTask((prevstate) => ({ ...prevstate, projectid: projectid }))
                            if (mainTaskDetails.projectid === undefined) { setProjectIdErr(true) }

                        }} className='rounded border border-slate-400 px-2 py-2 outline-none w-full' >
                            <option className='text-slate-500/50' selected value="" >Select Project</option>
                            {projectList.map(project => {
                                return (
                                    <option key={project.id} value={project.id}>{project.projectname}</option>
                                )
                            })}
                        </select>
                        {/* <ButtonDropdown name="projectid" handleUpdateItem={handleUpdateItem} labelsMap={projectsObj} defaultSelectedValue="" /> */}
                    </div>
                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Billing Type : </label>
                        {isRequiredError && (!mainTaskDetails.billingtype) && <span className='text-red-500'>*</span>}

                        <select value={isAddTask ? copytask.billingtype : mainTaskDetails.billingtype} onChange={(e) => {
                            const billingtype = e.target.value
                            setMainTaskDetails((prevstate) => ({ ...prevstate, billingtype: billingtype }))
                            setcopyTask((prevstate) => ({ ...prevstate, billingtype: billingtype }))

                        }} className='rounded border border-slate-400 px-2 py-2 outline-none w-full'>
                            <option className='text-slate-500/50' value="">Select Billing Type</option>
                            {/* <option selected value={undefined}>Select Billing Type</option> */}
                            {billingType.map(bt => {
                                return (
                                    <option key={bt.key} value={bt.value}>{bt.value}</option>
                                )
                            })}
                        </select>
                        {/* <ButtonDropdown name="billingtype" handleUpdateItem={handleUpdateItem} labelsMap={billingType} defaultSelectedValue="internal" /> */}
                    </div>


                    {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Task Description: </label>
                    <ButtonDropdown name="taskdescriptionid" handleUpdateItem={handleUpdateItem} labelsMap={taskdescriptionObj} defaultSelectedValue="" />
                </div> */}
                </div>

                {/* <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Module Name: </label>
                        <ButtonDropdown name="moduleid" handleUpdateItem={handleUpdateItem} labelsMap={moduleaObj} defaultSelectedValue="" />
                    </div>

                </div> */}
                <div className='w-full flex flex-row gap-2 mt-4 ml-5'>

                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>

                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Task Type: </label>
                        {isRequiredError && (!mainTaskDetails.tasktype) && <span className='text-red-500'>*</span>}

                        <select value={isAddTask ? copytask.tasktype : mainTaskDetails.tasktype} onChange={(e) => {
                            setMainTaskDetails({ ...mainTaskDetails, tasktype: e.target.value })
                            setcopyTask({ ...copytask, tasktype: e.target.value })
                            getAllDescriptionbyTaskType(e.target.value)
                        }} className='outline-none border border-slate-400 px-2 w-full py-2 rounded' name="taskdescription" >
                            <option className='text-slate-500/50' value="">Select Task Type</option>
                            {tasktypeList.map(t => {
                                return (
                                    <option key={t.key} value={t.key}>{t.value}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Task Description: </label>
                        {isRequiredError && (!mainTaskDetails?.taskdescriptionid || (mainTaskDetails?.taskdescriptionid !== undefined && mainTaskDetails?.taskdescriptionid <= 0)) && <span className='text-red-500'>*</span>}
                        <select value={isAddTask ? copytask.taskdescriptionid : mainTaskDetails.taskdescriptionid}
                            onChange={(e) => {
                                setMainTaskDetails({ ...mainTaskDetails, taskdescriptionid: Number(e.target.value) });
                                setcopyTask({ ...copytask, taskdescriptionid: Number(e.target.value) })
                            }} className='outline-none border border-slate-400 px-2 w-full py-2 rounded' name="taskdescription" required>
                            <option className='text-slate-500/50' value="">Select Task Description</option>
                            {taskdescription.map(t => {
                                return (
                                    <option key={t.id} value={t.id}>{t.taskdescription}</option>
                                )
                            })}
                        </select>
                    </div>


                </div>

                {/* <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                    <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                        <label className='justify-self-end  font-bold basis-[35%] text-end'>Module Name: </label>
                        <select className='outline-none border border-slate-400 px-2 w-full py-2 rounded' name="modulename" required
                            onChange={(e) => {
                                



                            }}>
                            <option value="">Select Task Description</option>
                            {

                            }
                        </select>
                    </div>

                </div> */}

                <div className='flex flex-col'>
                    {tasks.map(task => {
                        return (
                            <TaskComponent isRequiredError={isRequiredError} mainTaskDetails={mainTaskDetails} handleUpdateItem={handleUpdateItem} task={task} key={task.id} copytask={copytask} addArr={addArray} isAddTask={isAddTask} onChangeAssignee={onChangeAssignee} moduleaObj={moduleaObj} />
                        )
                    })}

                </div>
                {(!isValidCommentSatrtDate || !isValidCommentEndDate) && invalidTextErr && (
                    <div className='flex flex-col items-center w-full mb-7 text-red-600'>
                        <p>Invalid Dates and Time</p>

                    </div>
                )}

                <div className='flex flex-row justify-end ml-5'>
                    {/* <div className='flex flex-col items-center w-full mt-5'>
                    <button onClick={handleAddItem} className='bg-red-500 text-white px-3 py-1 rounded'>Create New Task</button>
                </div> */}

                    {
                        isAddTask === false && submitLoader && (
                            <div className='flex flex-col items-center w-full mb-7'>
                                {/* <button onClick={handleTaskSubmit} className='bg-sky-600 text-white px-3 py-1 rounded'>Submit Task</button> */}

                                <Button className='bg-sky-600 text-white font-semibold' isLoading>
                                    Loading
                                </Button>
                            </div>
                        )
                    }

                    {isAddTask === false && !submitLoader && (
                        <div className='flex flex-col items-center w-full mb-7'>
                            {/* <button onClick={handleTaskSubmit} className='bg-sky-600 text-white px-3 py-1 rounded'>Submit Task</button> */}

                            <Button className='bg-sky-600 text-white font-semibold' onClick={handleTaskSubmit}>
                                Submit Task
                            </Button>
                        </div>)}


                    {isAddTask && addArray && addArray.map((id: number, i: any) => {
                        return (
                            <div className='flex gap-2 mt-3' key={id}>
                                <button className='mx-2 rounded-full bg-slate-400 w-6 h-6 mt-2' onClick={() => pageClick(id)}  >{i + 1}</button>

                            </div>)
                    })}
                    {isAddTask && (
                        <div className='mx-3 flex items-center justify-center'>
                            <Tooltip color={"foreground"} content={"Finish Bulk Tasks Creation"} closeDelay={100}>
                                <Button isIconOnly className='bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center' onClick={doneClickHandler}>
                                    <MdDone className='text-2xl' />
                                </Button>
                            </Tooltip>
                        </div>

                    )}


                    {(user.role === "manager" || user.role === "admin") && (
                        <div className='mx-3 flex items-center justify-center'>
                            <Tooltip color={"foreground"} content={"Create Bulk Tasks"} closeDelay={100}>
                                <Button isIconOnly onClick={addTask} className='bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center'>
                                    <TiPlus className='text-2xl' />
                                </Button>
                            </Tooltip>
                        </div>

                    )}



                </div>
            </div>
        </div>
    )
}


export default TasksPage
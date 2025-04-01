'use client'
import React, { useState, useEffect } from 'react'
import {
    Textarea
} from "@nextui-org/react";
import { apiUrl } from '@/config';
import TaskComponent from '@/app/components/TaskComponent';
import { axiosinstance } from '@/app/libs/axiosinstance';
import ButtonDropdown from '@/app/components/ButtonDropdown';
import { useRouter } from 'next/navigation';
import { Breadcrumbs, BreadcrumbItem, Button } from "@nextui-org/react";
import EditTaskComponent from '@/app/components/EditTaskComponent';
import moment, { Moment } from 'moment';
import { toast, ToastContainer } from 'react-toastify';

type Key = string | number;
export type IKeyValue = {
    [K in Key]: string;
};



export interface ITask {
    id?: number | string;
    taskname?: string;
    remarkforinnerhtml?: string;
    remarkforeditting?: string;
    tasktype?: string;
    priority?: string;
    assignstartdate: string | Date | Moment | undefined;
    actualstartdate: string | Date | Moment | undefined;
    duedate: string | Date | Moment | undefined;
    completiondate: string | Date | Moment | undefined | null;
    status?: string;
    billingtype?: string;
    approvalstatus?: string;
    clientid?: number;
    clientname?: string,
    productname?: string;
    projectname?: string,
    projectlead?: string;
    teamleaduser?: string;
    assigneeuser?: string;
    projectid?: number;
    taskdescriptionid?: number;
    taskdescriptionname?: string;
    projectleaduserid?: number;
    moduleid?: number;
    flag?: string;
    modulename?: string;
    percentage?: number | string;
    comments: IComment[];
    productid?: number;
    assigneeuserid?: number;
    timetocompletetask?: string;
}


export interface IMainTaskDetails {
    productid?: number;
    tasktype?: string;
    clientid?: number;
    projectid?: number;
    taskdescriptionid?: number;
}

interface IProject {
    id: number;
    projectname: string;
    projectdescription: string;
}

interface IModule {
    id: number;
    modulename: string;
    moduledescription: string;
    weightage: string;
    project: IProject;
}


interface IComment {
    id: number;
    comment: string;
    taskid?: number;
    user?: IUser;
    startdate: Date;
    enddate: Date;
    createdAt: Date;
}

type IUser = {
    id: number;
    fullname: string;
}


interface ITaskDescription {
    id: number;
    taskdescription: string;
    tasktype?: string;
}

function EditTaskPage({ params }: { params: { taskid: string } }) {
    const router = useRouter();
    /////////////
    const [task, setTask] = useState<ITask>({
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
        projectid: 0,
        projectleaduserid: 0,
        assigneeuserid: 0,
        timetocompletetask: "",
        taskdescriptionid: 0
    });

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
        clientid: 0,
        projectleaduserid: 0,
        assigneeuserid: 0,
        timetocompletetask: "",
        taskdescriptionid: 0
    });



    // const [comments, setComments] = useState<IComment[]>([])
    const [newComment, setNewComment] = useState<string>("")
    const [taskdescription, setTaskDescription] = useState<ITaskDescription[]>([])
    async function getAllDescriptionbyTaskType(tasktype: string | undefined) {
        try {
            let { data } = await axiosinstance.get(`${apiUrl}/api/taskdescription/getalltaskdescriptionbytasktype/${tasktype}`)
            if (data.success) {
                // const taskDescription = formatDataForTaskdescriptionDropdown(data.data)
                // setTaskdescriptionObj(taskDescription)
                setTaskDescription(data.data)
            }
        } catch (err) {
            console.log("Error in getallusers API", err)
        }
    }

    useEffect(() => {
        getAllDescriptionbyTaskType(task.tasktype)
    }, [task.tasktype])
    useEffect(() => {
        async function fetchTask() {
            try {
                const { data } = await axiosinstance.get(`${apiUrl}/api/task/gettaskbyid/${Number(params.taskid)}`)
                if (data.success) {
                    setTask(data.data)
                    setcopyTask(data.data)

                }
            } catch (err) {
                console.log(err)
            }
        }
        fetchTask();
    }, [params.taskid])

    ///////////////////
    const [managerRoleObj, setManagerRoleObj] = useState<IKeyValue>({})
    const [usersRoleObj, setUserRoleObj] = useState<IKeyValue>({})


    const [mainTaskDetails, setMainTaskDetails] = useState<IMainTaskDetails>({
        productid: 0,
        clientid: 0,
        projectid: 0,
        taskdescriptionid: 0
    })

    // const [tasks, setTasks] = useState<ITask[]>([]);
    // const [newTask, setNewTask] = useState<ITask>({
    //     id: new Date().toLocaleString(),
    //     taskname: "",
    //     priority: "",
    //     actualstartdate: new Date().toISOString().slice(0, -8),
    //     duedate: new Date().toISOString().slice(0, -8),
    //     completiondate: new Date().toISOString().slice(0, -8),
    //     status: "",
    //     billingtype: "",
    //     approvalstatus: "",
    //     clientid: 0,
    //     projectid: 0,
    //     taskdescriptionid: 0,
    //     projectleaduserid: 0,
    //     assigneeuserid: 0,
    //     remarkforinnerhtml: "",
    //     remarkforeditting: "",
    //     flag: "",
    //     moduleid: 0,
    //     comments:[]
    // });

    const [productsObj, setProductsObj] = useState<IKeyValue>({})

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
                    const projects: IKeyValue = formatDataForProductDropdown(data.data)
                    setProductsObj(projects)


                }
            } catch (err) {
                console.log("Error in getAllProducts API", err)
            }
        }
        getAllProducts();
    }, []);

    useEffect(() => {
        async function getAllProjects(value: any) {

            const productid = Number(value)
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getprojectsbyproductid/${productid}`)
                if (data.success) {
                    const projects: IKeyValue = formatDataForProjectDropdown(data.data)
                    setProjectsObj(projects)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllProjects(task.productid);
    }, [task.productid])

    useEffect(() => {

        async function getAllClients(value: string | number | undefined) {
            try {
                const productid = Number(value)
                let { data } = await axiosinstance.get(`${apiUrl}/api/client/getclientbyproductid/${productid}`)
                if (data.success) {
                    const clients = formatDataForClientDropdown(data.data)
                    setClientsObj(clients)

                    // if (task.productid !== copytask.productid) {
                    //     console.log("ELLO 1")
                    //     if (data.data.length > 0) {
                    //         console.log("ELLO 2",data.data[0].id)
                    //         setMainTaskDetails((prevstate) => ({
                    //             ...prevstate, clientid: data.data[0].id
                    //         }))

                    //         setTask((prevstate) => ({
                    //             ...prevstate, clientid: data.data[0].id
                    //         }))
                    //     }
                    // }
                }
            } catch (err) {
                console.log("Error in getAllClients API", err)
            }
        }

        getAllClients(task.productid)
    }, [task.productid])

    const [moduleaObj, setModulesObj] = useState<IKeyValue>({})



    useEffect(() => {
        async function getAllModules() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/module/getallmodules`)
                if (data.success) {
                    const modules: IKeyValue = formatDataForModuleDropdown(data.data)
                    setModulesObj(modules)
                }
            } catch (err) {
                console.log("Error in getAllModules API", err)
            }
        }
        getAllModules();
    }, [])



    const [isValidCommentSatrtDate, setIsValidCommentStartDate] = useState<any>(true)
    const [isValidCommentEndDate, setIsValidCommentEndDate] = useState<any>(true)

    const [invalidTextErr, setInvalidTextErr] = useState<any>(false)

    const handleUpdateItem = (taskid: string, name: string, value: any) => {

        if (taskid) {
            if (name === "assignstartdate") {
                setIsValidCommentStartDate(value && value.isValid && value.isValid())
            }

            if (name === "duedate") {
                setIsValidCommentEndDate(value && value.isValid && value.isValid())
            }


            setTask({ ...task, [name]: value })
            setMainTaskDetails({ ...mainTaskDetails, [name]: value })
        }






    }

    // const handleUpdateItem = (taskid: string, name: string, value: string) => {
    //     if (taskid) {
    //         let newValue: string | number | Date = value
    //         const updatedItems = tasks.map((task) => {
    //             if (task.id === taskid) {
    //                 return { ...task, [name]: newValue }
    //             } else {
    //                 return task
    //             }
    //         })
    //         setTasks(updatedItems)

    //     } else {
    //         if (name === "productid") {
    //             getAllProjects(value)
    //             getAllClients(value)
    //         }
    //         setMainTaskDetails({ ...mainTaskDetails, [name]: value })
    //     }
    // }

    // const handleAddItem = () => {
    //     setTasks([...tasks, { ...newTask, id: new Date().toLocaleString() }]);
    // };

    const formatDataForModuleDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, modulename }: { id: number, modulename: string }) => {
            acc[id] = modulename;
            return acc;
        }, {} as any);
        return user
    }

    const formatDataForUserDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, fullname }: { id: number, fullname: string }) => {
            acc[id] = fullname;
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

    const formatDataForTaskdescriptionDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, taskdescription }: { id: number, taskdescription: string }) => {
            acc[id] = taskdescription;
            return acc;
        }, {} as any);
        return user
    }

    useEffect(() => {
        async function getAllUsersForManager() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallusersbyrole/manager`)
                if (data.success) {
                    const user: IKeyValue = formatDataForUserDropdown(data.data)
                    setManagerRoleObj(user)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllUsersForManager();
    }, [])

    useEffect(() => {
        async function getAllUsersForUser() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallusersbyrole/user`)
                if (data.success) {
                    const user: IKeyValue = formatDataForUserDropdown(data.data)
                    setUserRoleObj(user)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllUsersForUser();
    }, [])

    const [projectsObj, setProjectsObj] = useState<IKeyValue>({})


    const [clientsObj, setClientsObj] = useState<IKeyValue>({})

    const formatDataForClientDropdown = (data: any) => {
        const user: any = data.reduce((acc: any, { id, clientname }: { id: number, clientname: string }) => {
            acc[id] = clientname;
            return acc;
        }, {} as any);
        return user
    }

    // useEffect(()=>{
    //     getAllClients(task.clientid)
    // },[task.clientid])

    const typeMap: any = {
        ["Development"]: "Development",
        ["Support"]: "Support",
    }

    const descType = {
        Development: "Development",
        Support: "Support",
    }


    const handleTaskUpdate = async () => {
        // if (!isValidCommentSatrtDate || !isValidCommentEndDate) {
        //     setInvalidTextErr(true)
        //     //window.alert("Invalid Date and Time")
        //     return false
        // }



        try {
            let newBody = task

            const endpoint = `${apiUrl}/api/task/updatetask`
            const { data } = await axiosinstance.put(endpoint, newBody)
            if (data.success) {
                toast.success(data.message, { autoClose: 500 })
                window.alert(data.message)
                return router.push(`/taskapp/tasks/${task.id}`)
                // return router.push("/taskapp/projects")
            }
        } catch (error: any) {
            console.log(error)
        }

    }



    const billingType: any = {
        Billable: "Billable",
        ["Non Billable"]: "Non Billable"
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
                    <BreadcrumbItem onClick={() => router.push(`/taskapp/task/${task.id}/edit`)} >Edit Tasks</BreadcrumbItem>
                </Breadcrumbs>
            </div>
            <div className='w-full flex flex-row gap-2 mt-4 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Product Name: </label>
                    {task.productname}
                    {/* <ButtonDropdown handleUpdateItem={handleUpdateItem} name="productid" labelsMap={productsObj} defaultSelectedValue={task.productid} /> */}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Client Name: </label>
                    {/* <ButtonDropdown handleUpdateItem={handleUpdateItem} name="clientid" labelsMap={clientsObj} defaultSelectedValue={task.clientid} /> */}
                    <select onChange={(e) => { setTask({ ...task, clientid: Number(e.target.value) }) }} value={task.clientid} className='outline-none border border-slate-400 px-2 w-full py-2 rounded'>
                        {
                            Object.entries(clientsObj).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))
                        }
                    </select>
                </div>


            </div>

            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Project Name: </label>
                    {task.projectname}
                    {/* <ButtonDropdown handleUpdateItem={handleUpdateItem} name="projectid" labelsMap={projectsObj} defaultSelectedValue={task.projectid} /> */}
                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Billing Type : </label>
                    <ButtonDropdown name="billingtype" handleUpdateItem={handleUpdateItem} taskid={task.id} labelsMap={billingType} defaultSelectedValue={task.billingtype} />
                </div>

                {/* <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Task Description: </label>
                    <ButtonDropdown name="taskdescriptionid" handleUpdateItem={handleUpdateItem} labelsMap={taskdescriptionObj} defaultSelectedValue="" />
                </div> */}
            </div>
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Task Type: </label>
                    {/* <ButtonDropdown handleUpdateItem={handleUpdateItem} name="tasktype" labelsMap={typeMap} defaultSelectedValue={task.tasktype} /> */}
                    <select onChange={(e) => setTask({ ...task, tasktype: e.target.value })} value={task.tasktype} className='outline-none border border-slate-400 px-2  py-2 rounded'>


                        {Object.entries(descType).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}

                    </select>

                </div>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Task Description:  </label>
                    <select onChange={(e) => setTask({ ...task, taskdescriptionid: Number(e.target.value) })} value={task.taskdescriptionid}
                        className='outline-none border border-slate-400 px-2 w-full py-2 rounded'>
                        {taskdescription.map(td => {
                            return (
                                <option key={td.id} value={td.id}>{td.taskdescription}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
            {/* 
            <div className='w-full flex flex-row gap-2 mt-5 ml-5'>
                <div className='basis-[47%] flex flex-row gap-2 justify-start items-center'>
                    <label className='justify-self-end  font-bold basis-[35%] text-end'>Module Name: </label>
                    <ButtonDropdown handleUpdateItem={handleUpdateItem} name="moduleid" labelsMap={moduleaObj} defaultSelectedValue="" />
                </div>
            </div> */}

            <div className='flex flex-col'>
                {/* {tasks.map(task => {
                    return ( */}
                <EditTaskComponent copytask={copytask} handleUpdateItem={handleUpdateItem} usersRoleObj={usersRoleObj} managerRoleObj={managerRoleObj} task={task} key={task.id} />
                {/* )
                })
                } */}
            </div>
            {(!isValidCommentSatrtDate || !isValidCommentEndDate) && invalidTextErr && (
                <div className='flex flex-col items-center w-full mb-7 text-red-600'>
                    <p>Invalid Dates and Time</p>

                </div>
            )}
            {/* <div className='flex flex-col items-end w-full mt-5'>
                <button onClick={handleAddItem} className='bg-red-500 text-white px-3 py-1 rounded'>Create New Task</button>
            </div> */}
            <div className='flex flex-col items-center w-full mt-5'>
                <Button onClick={handleTaskUpdate} className='bg-sky-600 text-white px-3 py-1 rounded font-semibold'>Update Task</Button>
            </div>
            <br /><br /><br />
        </div>
    )
}


export default EditTaskPage
'use client'
import { axiosinstance } from '@/app/libs/axiosinstance';
import { apiUrl } from '@/config';
import React, { useState, useEffect, FormEvent } from 'react'
import Select from 'react-select';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import "react-datetime/css/react-datetime.css";
import { useRouter } from 'next/navigation'

import {
    Input,
    Button,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Pagination,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { ITask } from '../tasks/[taskid]/edit/page';
import moment, { Moment } from 'moment';
import Datetime from 'react-datetime';
import { IoMdDownload } from "react-icons/io";

interface IProduct {
    label: string;
    value: string;
}

interface IClient {
    label?: string;
    value?: string;
}
interface IProject {
    label?: string;
    value?: string;
}

interface IUser {
    label?: string;
    value?: string;
    role?: string;
}

interface IAssigneeUserCounter {
    value: string;
    label: string;
    role: string;
    count: Icount
}

interface IBillableType {
    label?: string;
    value?: string;
}

interface Icount {
    totaltask: number | string;
    opentask: number | string;
    inprosesstask: number | string;
    closetask: number | string;
    holdTask: number | string;
}
interface IStatus {
    label?: string;
    value?: string;
}



const billingType: IBillableType[] = [
    { value: "all", label: "All" },
    { value: "Billable", label: "Billable" },
    { value: "Non Billable", label: "Non Billable" }
]


const status: IStatus[] = [
    { value: "all", label: "All" },
    { value: "Open", label: "Open" },
    { value: "Close", label: "Close" },
    { value: "In Progress", label: "In Progress" },
    { value: "Hold", label: "Hold" },

]


interface IFilters {
    products: readonly IProduct[],
    clients: readonly IClient[],
    projects: readonly IProject[],
    projectleads: readonly IUser[],
    assignees: readonly IUser[],
    billingtype: readonly IBillableType[],
    status: readonly IStatus[],
    fromdate?: string | Moment,
    todate?: string | Moment
}



export interface ITaskTimesheet {
    id?: number | string;
    taskname?: string;
    remarkforinnerhtml?: string;
    remarkforeditting?: string;
    tasktype?: string;
    priority?: string;
    assignstartdate: string | Date | Moment | undefined;
    actualstartdate: string | Date | Moment | undefined;
    duedate: string | Date | Moment | undefined;
    completiondate: string | Date | Moment | undefined;
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
    percentage?: number;
    comments: IComment[];
    productid?: number;
    assigneeuserid?: number;
    timetocompletetask?: string;
    commentstartdate?: Date;
    commentenddate?: Date
    comment?: string;
    po_date?: Date
    taskcreatedate?: Date;
    clientcode?: string;
    productcode?: string;
    projectcode?: string;
    projectcategory?: string;
    commentid?: number;
    commentduration?: string;
    taskduration?: string;
}

interface IComment {
    id: number;
    comment: string;
    taskid?: number;
    user?: IUser;
    startdate: Date;
    endDate: Date;
    createdAt: Date;
}



function ReportsPage() {
    const [clientsList, setClientsList] = useState<IClient[]>([{ value: "all", label: "All" }])
    const [productsList, setProductsList] = useState<IProduct[]>([{ value: "all", label: "All" }]);
    const [projectsList, setProjectsList] = useState<IProject[]>([{ value: "all", label: "All" }])
    const [projectleads, setProjectLeads] = useState<IUser[]>([{ value: "all", label: "All" }])
    const [assignees, setAssignees] = useState<IUser[]>([{ value: "all", label: "All" }])
    const [summarydata, setSummarydata] = useState<ITaskTimesheet[]>([])
    const [taskReports, setTaskReports] = useState<ITaskTimesheet[]>([])
    const [timesheetdata, setTimesheetdata] = useState<ITaskTimesheet[]>([])
    const [selectedReportType, setSelectedReportType] = useState<string>("summary")
    const router = useRouter();
    const [summaryPageNo, setsummaryPageNo] = useState(1)
    const [timeSheetPageNo, setTimeSheetPageNo] = useState(1)
    const [missingUserPageNo, setMissingUserPageNo] = useState(1)
    const [missingUser, setMissingUser] = useState<IUser[]>([])
    const [assigneeCounterDetails, setAssigneeCounterDetails] = useState<IAssigneeUserCounter[]>([])
    const [missingUserData, setMissinguserData] = useState<any>([])
    const rowsPerPage = 15;

    const summaryPages = Math.ceil(summarydata.length / rowsPerPage);

    const summaryItems = React.useMemo(() => {
        const start = (summaryPageNo - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return summarydata.slice(start, end);
    }, [summaryPageNo, summarydata]);

    //Time sheet----
    const timeSheetPages = Math.ceil(timesheetdata.length / rowsPerPage);

    const timeSheetItems = React.useMemo(() => {
        const start = (timeSheetPageNo - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return timesheetdata.slice(start, end);
    }, [timeSheetPageNo, timesheetdata]);


    //Missing User--- assigneeCounterDetails
    const missingUserPages = Math.ceil(missingUserData.length / rowsPerPage);
    const missingUserItems = React.useMemo(() => {
        const start = (missingUserPageNo - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return missingUserData.slice(start, end)
    }, [missingUserPageNo, missingUserData])



    const [filters, setFilters] = useState<IFilters>({
        products: [],
        clients: [],
        projects: [],
        projectleads: [],
        billingtype: [],
        status: [],
        assignees: [],
        fromdate: moment(),
        todate: moment()
    });
    useEffect(() => {
        async function getallprojectleads() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallprojectleads`)
                if (data.success) {
                    setProjectLeads(data.data)
                }
            } catch (err) {
                console.log("Error in getAllUsersForManager API", err)
            }
        }
        getallprojectleads();
    }, [])

    useEffect(() => {
        async function getallassignee() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallassignee`)
                if (data.success) {
                    setAssignees(data.data)
                }
            } catch (err) {
                console.log("Error in getallassignee API", err)
            }
        }
        getallassignee();
    }, [])

    useEffect(() => {
        async function getAllProjects() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallprojects`)
                if (data.success) {
                    setProjectsList(data.data)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllProjects();
    }, [])

    useEffect(() => {
        async function getAllProducts() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallproducts`)
                if (data.success) {
                    setProductsList(data.data)
                }
            } catch (err) {
                console.log("Error in getAllProducts API", err)
            }
        }
        getAllProducts();
    }, [])

    useEffect(() => {
        async function getAllClients() {
            try {
                let { data } = await axiosinstance.get(`${apiUrl}/api/task/getallclients`)
                if (data.success) {
                    setClientsList(data.data)
                }
            } catch (err) {
                console.log("Error in getallusers API", err)
            }
        }
        getAllClients();
    }, [])



    const fetchData = async () => {
        try {
            let newFilters = {
                products: filters.products.map(f => f.value),
                clients: filters.clients.map(f => f.value),
                projects: filters.projects.map(f => f.value),
                projectleads: filters.projectleads.map(f => f.value),
                assignees: filters.assignees.map(f => f.value),
                billingtype: filters.billingtype.map(f => f.value),
                status: filters.status.map(f => f.value),
                fromdate: filters.fromdate,
                todate: filters.todate,
            }


            const { data } = await axiosinstance.get(`${apiUrl}/api/task/taskreports`, { params: newFilters });
            if (data.success) {
                setSummarydata(data.data)
                setsummaryPageNo(1)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const fetchTaskReportData = async () => {

        try {
            let newFilters = {
                products: filters.products.map(f => f.value),
                clients: filters.clients.map(f => f.value),
                projects: filters.projects.map(f => f.value),
                projectleads: filters.projectleads.map(f => f.value),
                assignees: filters.assignees.map(f => f.value),
                billingtype: filters.billingtype.map(f => f.value),
                status: filters.status.map(f => f.value),
                fromdate: filters.fromdate,
                todate: filters.todate,
            }
            const { data } = await axiosinstance.get(`${apiUrl}/api/task/taskreportwithcomments`, { params: newFilters });
            if (data.success) {
                setTaskReports(data.data)

            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchTimesheetData = async () => {
        try {
            let newFilters = {
                products: filters.products.map(f => f.value),
                clients: filters.clients.map(f => f.value),
                projects: filters.projects.map(f => f.value),
                projectleads: filters.projectleads.map(f => f.value),
                assignees: filters.assignees.map(f => f.value),
                billingtype: filters.billingtype.map(f => f.value),
                status: filters.status.map(f => f.value),
                fromdate: moment(filters.fromdate).format('YYYY-MM-DD'),
                todate: moment(filters.todate).format('YYYY-MM-DD'),
            }
            const { data } = await axiosinstance.get(`${apiUrl}/api/task/tasktimesheetwithcomments`, { params: newFilters });
            if (data.success) {
                setTimesheetdata(data.data)
                setTimeSheetPageNo(1)


            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const customStyles = {
        container: (base: any) => ({
            ...base,
            width: '350px',
        }),
    }

    const getTodayDate = () => {
        var today: Date | string = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '-' + dd + '-' + yyyy;
        return today;
    }
    const exportToCSVSummaryData = () => {

        const newData = summarydata.map((report, index) => {
            const actualSatrtDate = report.actualstartdate ? moment(report.actualstartdate).format('DD/MM/YYYY HH:mm:ss') : null
            const dueDate = report.duedate ? moment(report.duedate).format('DD/MM/YYYY HH:mm:ss') : null
            const completionDate = report.completiondate ? moment(report.completiondate).format('DD/MM/YYYY HH:mm:ss') : null
            const assignstartdate = report.assignstartdate ? moment(report.assignstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
            return {
                ["Sr No"]: index + 1,
                ["Client Name"]: report.clientname,
                ["Product Name"]: report.productname,
                ["Project Name"]: report.projectname,
                ["Task Desc"]: report.taskdescriptionname,
                ["Module"]: report?.modulename,
                ["Assinee User"]: report.assigneeuser,
                ["Billing Type"]: report.billingtype,
                ["Project Lead"]: report.projectlead,
                ["Status"]: report.status,
                ["Progress"]: report.percentage,
                ["Assign Date"]: assignstartdate,
                ["Task Completion Duration"]: report.taskduration,
                ["Actual Start Date"]: actualSatrtDate,
                ["Due Date"]: dueDate,
                ["Completion Date"]: completionDate,
                ["Remark"]: report.remarkforinnerhtml
            }
        })
        let fileName = "Summary_Reports";
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';


        const ws = XLSX.utils.json_to_sheet(newData);
        const wb = { Sheets: { 'Summary_Report': ws }, SheetNames: ['Summary_Report'] };
        const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx', type: 'array'
        });
        const data = new Blob([excelBuffer], { type: fileType });
        let todayDate = getTodayDate();
        FileSaver.saveAs(data, fileName + "_" + todayDate + fileExtension);

    }

    const exportToCSVTaskReportData = () => {

        const newData = taskReports.map((report, index) => {
            const taskcreatedate = moment(report.taskcreatedate).format('DD/MM/YYYY HH:mm:ss');
            const po_date = moment(report.po_date).format('DD/MM/YYYY HH:mm:ss');
            const assignstartdate = report.assignstartdate ? moment(report.assignstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
            const actualstartdate = report.actualstartdate ? moment(report.actualstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
            const duedate = report.duedate ? moment(report.duedate).format('DD/MM/YYYY HH:mm:ss') : null;
            const commentstartdate = report.commentstartdate ? moment(report.commentstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
            const commentenddate = report.commentenddate ? moment(report.commentenddate).format('DD/MM/YYYY HH:mm:ss') : null;

            return {
                ["Sr No."]: index + 1,
                ["Task Id"]: report.id,
                ["Module"]: report?.modulename,
                ["Task Create Date"]: taskcreatedate,
                ["Client Code"]: report.clientcode,
                ["Client Name "]: report.clientname,
                ["PO Date"]: po_date,
                ["Product Name"]: report.productname,
                ["Project Code"]: report.projectcode,
                ["Project Category"]: report.projectcategory,
                ["Project"]: report.projectname,
                ["Task Type "]: report.tasktype,
                ["Task Descriptions"]: report.taskdescriptionname,
                ["Billing Type"]: report.billingtype,
                ["Project Lead"]: report.projectlead,
                ["Priority"]: report.priority,
                ["Assignee"]: report.assigneeuser,
                ["Assign Date"]: assignstartdate,
                ["Actual Start Date"]: actualstartdate,
                ["Due Date"]: duedate,
                ["Status"]: report.status,
                ["Remark"]: report.remarkforinnerhtml,
                ["Comment"]: report.comment,
                ["Comment Id"]: report.commentid,
                ["Task Start Time"]: commentstartdate,
                ["Task End Time"]: commentenddate,
                ["Timesheet Duration"]: report?.commentduration
            }
        })
        let fileName = "Task_Reports";
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';


        const ws = XLSX.utils.json_to_sheet(newData);
        const wb = { Sheets: { 'Task_Report': ws }, SheetNames: ['Task_Report'] };
        const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx', type: 'array'
        });
        const data = new Blob([excelBuffer], { type: fileType });
        let todayDate = getTodayDate();
        FileSaver.saveAs(data, fileName + "_" + todayDate + fileExtension);

    }

    const exportToCSVTimesheetData = () => {

        const newData = timesheetdata.map((report, index) => {
            const taskcreatedate = moment(report.taskcreatedate).format('DD/MM/YYYY HH:mm:ss');
            const po_date = moment(report.po_date).format('DD/MM/YYYY HH:mm:ss');
            const assignstartdate = report.assignstartdate ? moment(report.assignstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
            const actualstartdate = report.actualstartdate ? moment(report.actualstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
            const duedate = report.duedate ? moment(report.duedate).format('DD/MM/YYYY HH:mm:ss') : null;
            const commentstartdate = report.commentstartdate ? moment(report.commentstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
            const commentenddate = report.commentenddate ? moment(report.commentenddate).format('DD/MM/YYYY HH:mm:ss') : null;
            const completiondate = report.completiondate ? moment(report.completiondate).format('DD/MM/YYYY HH:mm:ss') : null;
            const taskduration = report.taskduration
            return {
                ["Sr No."]: index + 1,
                ["Task Id"]: report.id,
                ["Task Create Date"]: taskcreatedate,
                ["Client Code"]: report.clientcode,
                [" Client Name  "]: report.clientname,
                ["PO Date"]: po_date,
                ["Product Name"]: report.productname,
                // ["Project Code"]: report.projectcode,
                // ["Project Category"]: report.projectcategory,
                ["Project"]: report.projectname,
                ["Task Type "]: report.tasktype,
                ["Task Descriptions"]: report.taskdescriptionname,
                ["Billing Type"]: report.billingtype,
                ["Project Lead"]: report.projectlead,
                ["Priority"]: report.priority,
                ["Assignee"]: report.assigneeuser,
                ["Assign Date"]: assignstartdate,
                ["Actual Start Date"]: actualstartdate,
                ["Due Date"]: duedate,
                ["Completion Date"]: completiondate,
                ["Status"]: report.status,
                ["Task Duration"]: taskduration,
                ["Remark"]: report.remarkforinnerhtml,
                ["Comment"]: report.comment,
                ["Comment Id"]: report.commentid,
                ["Comment Start Time"]: commentstartdate,
                ["Comment End Time"]: commentenddate,
                ["Timesheet Duration"]: report?.commentduration
            }
        })
        let fileName = "Timesheet_Reports";
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';


        const ws = XLSX.utils.json_to_sheet(newData);
        const wb = { Sheets: { 'Timesheet_Report': ws }, SheetNames: ['Timesheet_Report'] };
        const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx', type: 'array'
        });
        const data = new Blob([excelBuffer], { type: fileType });
        let todayDate = getTodayDate();
        FileSaver.saveAs(data, fileName + "_" + todayDate + fileExtension);

    }



    const exportToCSVMissinguserReport = () => {

        const newData = assigneeCounterDetails.map((report, index) => {
            
            return {
                ["Sr No."]: index + 1,
                ["User Name"] : report.label,
                ["Total Task"] : report.count.totaltask,
                ["Open Tast"] : report.count.opentask,
                ["In Process Task"] : report.count.inprosesstask,
                ["Close Task"] :report.count.closetask,
                ["Hold Task"] : report.count.holdTask
            }
        })
        let fileName = "Timesheet_Reports";
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';


        const ws = XLSX.utils.json_to_sheet(newData);
        const wb = { Sheets: { 'PendingUser_Report': ws }, SheetNames: ['PendingUser_Report'] };
        const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx', type: 'array'
        });
        const data = new Blob([excelBuffer], { type: fileType });
        let todayDate = getTodayDate();
        FileSaver.saveAs(data, fileName + "_" + todayDate + fileExtension);

    }

    const isValidDate = (current: any) => {
        const currentDate = current.startOf('day');
        const minDate = moment('2021-01-01').startOf('day');
        const maxDate = moment('2030-01-01').startOf('day');

        return currentDate.isSameOrAfter(minDate) && currentDate.isSameOrBefore(maxDate);
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
    ///////////////////////////////////////////////////////////////////

    // const timesheetUserIds = new Set(timesheetdata.map(item => item.assigneeuserid));

    // // ✅ Step 2: Filter `assignee` to find missing users
    // const missingUsers = assignees.filter(user =>
    //     user.value !== "all" && !timesheetUserIds.has(Number(user.value)) && user.role ==="user"
    // );
    // console.log("Timesheet data--->", timesheetdata)
    // console.log("Assignee data--->", missingUsers)
    // setMissingUser(missingUsers)


    // useEffect( async () => {
    //     let dtArr: any = []
    //     const timesheetUserIds = new Set(timesheetdata.map(item => item.assigneeuserid));

    //     // ✅ Step 2: Filter `assignee` to find missing users
    //     const missingUsers = assignees.filter(user =>
    //         user.value !== "all" && !timesheetUserIds.has(Number(user.value)) && user.role === "user"
    //     );
    //     console.log("Timesheet data--->", timesheetdata)
    //     console.log("Assignee data--->", missingUsers)
    //     setMissingUser(missingUsers)

    //     await Promise.all(
    //         missingUsers.map(async (assignee) => {
    //             try {
    //                 const { data } = await axiosinstance.post(
    //                     `${apiUrl}/api/task/taskbyassignee`, 
    //                     { assigneeuserid: assignee?.value }
    //                 );
    //                 const d = { ...assignee, ...data };
    //                 dtArr.push(d);
    //             } catch (error) {
    //                 console.error("Error fetching data:", error);
    //             }
    //         })
    //     );
    //     setAssigneeCounterDetails(dtArr)
    //     setMissinguserData(dtArr)
    //     //setMissingUserPageNo(1)
    // }, [timesheetdata])


    useEffect( ()=>{
        getMissingUserData()
    },[filters])


    const getMissingUserData = async () => {
        fetchTimesheetData()
        let dtArr: any = []
        const timesheetUserIds = new Set(timesheetdata.map(item => item.assigneeuserid));

        const missingUsers = assignees.filter(user =>
            user.value !== "all" && !timesheetUserIds.has(Number(user.value)) && user.role === "user"
        );
        console.log("Timesheet data--->", timesheetdata)
        console.log("Assignee data--->", missingUsers)
        setMissingUser(missingUsers)

        await Promise.all(
            missingUsers.map(async (assignee) => {
                try {
                    const { data } = await axiosinstance.post(
                        `${apiUrl}/api/task/taskbyassignee`,
                        { assigneeuserid: assignee?.value }
                    );
                    const d = { ...assignee, ...data };
                    dtArr.push(d);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            })
        );
        setAssigneeCounterDetails(dtArr)
        setMissinguserData(dtArr)
        setMissingUserPageNo(1)

        console.log("Page no....", missingUserPageNo)
        console.log("total Page no....", timeSheetPages)
    }


    console.log("conter details:--------", assigneeCounterDetails)
    console.log("any type conter details:--------", missingUserData)
    console.log("Page no....", missingUserPageNo)
    console.log("total Page no....", missingUserPages)

    const tableData = () => {
        if (selectedReportType === "summary") {
            return (
                <Table bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={summaryPageNo}
                            total={summaryPages}
                            onChange={(page) => setsummaryPageNo(page)}
                        />
                    </div>
                }
                    topContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={summaryPageNo}
                                total={summaryPages}
                                onChange={(page) => setsummaryPageNo(page)}
                            />
                        </div>
                    }
                    isHeaderSticky
                    isStriped
                    aria-label="Summary Report table" >
                    <TableHeader>
                        <TableColumn > Sr No.</TableColumn>
                        <TableColumn> Client Name  </TableColumn>
                        <TableColumn>Product Name</TableColumn>
                        <TableColumn>Project Name</TableColumn>
                        <TableColumn>Task Description</TableColumn>
                        <TableColumn> Module</TableColumn>
                        <TableColumn>Assign User</TableColumn>
                        <TableColumn>Billing Type</TableColumn>
                        <TableColumn>Project Lead</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Progress</TableColumn>
                        <TableColumn>Task Completion Duration</TableColumn>
                        <TableColumn>Assign Date</TableColumn>
                        <TableColumn>Actual Start Date</TableColumn>
                        <TableColumn>Due Date</TableColumn>
                        <TableColumn>Completion Date</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {summaryItems.map((task, index) => {
                            const assignstartdate = task.assignstartdate ? moment(task.assignstartdate).format('DD/MM/YYYY HH:mm:ss') : null
                            const actualstartdate = task.actualstartdate ? moment(task.actualstartdate).format('DD/MM/YYYY HH:mm:ss') : null
                            const duedate = task.duedate ? moment(task.duedate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const completiondate = task.completiondate ? moment(task.completiondate).format('DD/MM/YYYY HH:mm:ss') : null;
                            return (
                                <TableRow key={index}>
                                    <TableCell >{((summaryPageNo - 1) * rowsPerPage) + (index + 1)}</TableCell>
                                    <TableCell>{task.clientname}</TableCell>
                                    <TableCell>{task.productname}</TableCell>
                                    <TableCell>{task.projectname}</TableCell>
                                    <TableCell>{task.taskdescriptionname}</TableCell>
                                    <TableCell>{task?.modulename}</TableCell>
                                    <TableCell>{task.assigneeuser}</TableCell>
                                    <TableCell>{task.billingtype}</TableCell>
                                    <TableCell>{task.projectlead}</TableCell>
                                    <TableCell style={{ color: setTextColor(task.status) }}>{task.status}</TableCell>
                                    <TableCell>{task?.percentage} %</TableCell>
                                    <TableCell>{task.taskduration}</TableCell>
                                    <TableCell>{assignstartdate}</TableCell>
                                    <TableCell>{actualstartdate}</TableCell>
                                    <TableCell>{duedate}</TableCell>
                                    <TableCell>{completiondate}</TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>)
        } else if (selectedReportType === "taskreport") {
            return (
                <Table isHeaderSticky isStriped aria-label="TaskReport table">
                    <TableHeader>
                        <TableColumn width="900">Sr No.</TableColumn>
                        <TableColumn>Task Id</TableColumn>
                        <TableColumn>Module</TableColumn>
                        <TableColumn>Task Create Date</TableColumn>
                        <TableColumn>Client Code</TableColumn>
                        <TableColumn> Client Name  </TableColumn>
                        <TableColumn>PO Date</TableColumn>
                        <TableColumn>Product Name</TableColumn>
                        <TableColumn>Project Code</TableColumn>
                        <TableColumn>Project Category</TableColumn>
                        <TableColumn>Project</TableColumn>
                        <TableColumn>Task Type </TableColumn>
                        <TableColumn>Task Descriptions</TableColumn>
                        <TableColumn>Billing Type</TableColumn>
                        <TableColumn>Project Lead</TableColumn>
                        <TableColumn>Priority</TableColumn>
                        <TableColumn>Assignee</TableColumn>
                        <TableColumn>Assign Date</TableColumn>
                        <TableColumn>Actual Start Date</TableColumn>
                        <TableColumn>Due Date</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Remark</TableColumn>
                        <TableColumn>Comment</TableColumn>
                        <TableColumn>Comment Id</TableColumn>
                        <TableColumn>Task Start Time</TableColumn>
                        <TableColumn>Task End Time</TableColumn>
                        <TableColumn>Timesheet Duration</TableColumn>
                        {/* <TableColumn>Comment Duration</TableColumn> */}
                    </TableHeader>
                    <TableBody>
                        {taskReports.map((task, index) => {
                            const taskcreatedate = moment(task.taskcreatedate).format('DD/MM/YYYY HH:mm:ss');
                            const po_date = moment(task.po_date).format('DD/MM/YYYY HH:mm:ss');
                            const assignstartdate = task.assignstartdate ? moment(task.assignstartdate).format('DD/MM/YYYY HH:mm:ss') : null
                            const actualstartdate = task.actualstartdate ? moment(task.actualstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const duedate = task.duedate ? moment(task.duedate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const commentstartdate = task.commentstartdate ? moment(task.commentstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const commentenddate = task.commentenddate ? moment(task.commentenddate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const commentduration = task.commentduration
                            return (
                                <TableRow key={index}>
                                    <TableCell width="900">{index + 1}</TableCell>
                                    <TableCell>{task.id}</TableCell>
                                    <TableCell>{task?.modulename}</TableCell>
                                    <TableCell>{taskcreatedate && taskcreatedate}</TableCell>
                                    <TableCell>{task.clientcode}</TableCell>
                                    <TableCell>{task.clientname}</TableCell>
                                    <TableCell>{po_date && po_date}</TableCell>
                                    <TableCell>{task.productname}</TableCell>
                                    <TableCell>{task.projectcode}</TableCell>
                                    <TableCell>{task.projectcategory}</TableCell>
                                    <TableCell>{task.projectname}</TableCell>
                                    <TableCell>{task.tasktype}</TableCell>
                                    <TableCell>{task.taskdescriptionname}</TableCell>
                                    <TableCell>{task.billingtype}</TableCell>
                                    <TableCell>{task.projectlead}</TableCell>
                                    <TableCell>{task.priority}</TableCell>
                                    <TableCell>{task.assigneeuser}</TableCell>
                                    <TableCell>{assignstartdate && assignstartdate}</TableCell>
                                    <TableCell>{actualstartdate && actualstartdate}</TableCell>
                                    <TableCell>{duedate && duedate}</TableCell>
                                    <TableCell style={{ color: setTextColor(task.status) }}>{task.status}</TableCell>
                                    <TableCell>{truncateText(task.remarkforinnerhtml, 20)}</TableCell>
                                    <TableCell>{truncateText(task.comment, 20)}</TableCell>
                                    <TableCell>{task.commentid}</TableCell>
                                    <TableCell>{commentstartdate !== null && commentstartdate}</TableCell>
                                    <TableCell>{commentenddate && commentenddate}</TableCell>
                                    <TableCell>{commentduration}</TableCell>
                                    {/* <TableCell>{commentDuration && commentDuration}</TableCell> */}

                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            )
        } else if (selectedReportType === "timesheetreport") {

            return (
                <Table isHeaderSticky isStriped aria-label="Timesheet table" className='w-full'
                    bottomContent={
                        <div className="flex w-full justify-center text-white">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={timeSheetPageNo}
                                total={timeSheetPages}
                                onChange={(page) => setTimeSheetPageNo(page)}
                                className='text-white'
                            />
                        </div>
                    }
                    topContent={
                        <div className="flex w-full justify-center text-white">
                            <Pagination className='text-white'
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={timeSheetPageNo}
                                total={timeSheetPages}
                                onChange={(page) => setTimeSheetPageNo(page)}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn >Sr No.</TableColumn>
                        <TableColumn>Task Id</TableColumn>
                        <TableColumn>Module</TableColumn>
                        <TableColumn>Task Create Date</TableColumn>
                        <TableColumn>Client Code</TableColumn>
                        <TableColumn> Client Name  </TableColumn>
                        <TableColumn>PO Date</TableColumn>
                        <TableColumn>Product Name</TableColumn>
                        {/* <TableColumn>Project Code</TableColumn>
                        <TableColumn>Project Category</TableColumn> */}
                        <TableColumn>Project</TableColumn>
                        <TableColumn>Task Type </TableColumn>
                        <TableColumn>Task Descriptions</TableColumn>
                        <TableColumn>Billing Type</TableColumn>
                        <TableColumn>Project Lead</TableColumn>
                        <TableColumn>Priority</TableColumn>
                        <TableColumn>Assignee</TableColumn>
                        <TableColumn>Assign Date</TableColumn>
                        <TableColumn>Actual Start Date</TableColumn>
                        <TableColumn>Due Date</TableColumn>
                        <TableColumn>Completion Date</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Task Duration</TableColumn>
                        <TableColumn>Remark</TableColumn>
                        <TableColumn>Comment</TableColumn>
                        <TableColumn>Comment Id</TableColumn>
                        <TableColumn>Comment Start Time</TableColumn>
                        <TableColumn>Comment End Time</TableColumn>
                        <TableColumn>Timesheet Duration</TableColumn>

                        {/* <TableColumn>Comment Duration</TableColumn> */}
                    </TableHeader>
                    <TableBody>
                        {timeSheetItems.map((task, index) => {
                            const completiondate = task.completiondate ? moment(task.completiondate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const taskcreatedate = moment(task.taskcreatedate).format('DD/MM/YYYY HH:mm:ss');
                            const po_date = moment(task.po_date).format('DD/MM/YYYY HH:mm:ss');
                            const assignstartdate = task.assignstartdate ? moment(task.assignstartdate).format('DD/MM/YYYY HH:mm:ss') : null
                            const actualstartdate = task.actualstartdate ? moment(task.actualstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const duedate = task.duedate ? moment(task.duedate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const commentstartdate = task.commentstartdate ? moment(task.commentstartdate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const commentenddate = task.commentenddate ? moment(task.commentenddate).format('DD/MM/YYYY HH:mm:ss') : null;
                            const commentduration = task.commentduration
                            const taskduration = task.taskduration


                            return (
                                <TableRow key={index}>
                                    <TableCell >{((timeSheetPageNo - 1) * rowsPerPage) + (index + 1)}</TableCell>
                                    <TableCell>{task.id}</TableCell>
                                    <TableCell>{task?.modulename}</TableCell>
                                    <TableCell>{taskcreatedate && taskcreatedate}</TableCell>
                                    <TableCell>{task.clientcode}</TableCell>
                                    <TableCell>{task.clientname}</TableCell>
                                    <TableCell>{po_date && po_date}</TableCell>
                                    <TableCell>{task.productname}</TableCell>
                                    {/* <TableCell>{task.projectcode}</TableCell>
                                    <TableCell>{task.projectcategory}</TableCell> */}
                                    <TableCell>{task.projectname}</TableCell>
                                    <TableCell>{task.tasktype}</TableCell>
                                    <TableCell>{task.taskdescriptionname}</TableCell>
                                    <TableCell>{task.billingtype}</TableCell>
                                    <TableCell>{task.projectlead}</TableCell>
                                    <TableCell>{task.priority}</TableCell>
                                    <TableCell>{task.assigneeuser}</TableCell>
                                    <TableCell>{assignstartdate && assignstartdate}</TableCell>
                                    <TableCell>{actualstartdate && actualstartdate}</TableCell>
                                    <TableCell>{duedate && duedate}</TableCell>
                                    <TableCell>{completiondate && completiondate}</TableCell>
                                    <TableCell style={{ color: setTextColor(task.status) }}>{task.status}</TableCell>
                                    <TableCell>{taskduration}</TableCell>
                                    <TableCell >{truncateText(task.remarkforinnerhtml, 20)}</TableCell>
                                    <TableCell>{truncateText(task.comment, 20)}</TableCell>
                                    <TableCell>{task.commentid}</TableCell>
                                    <TableCell>{commentstartdate !== null && commentstartdate}</TableCell>
                                    <TableCell>{commentenddate && commentenddate}</TableCell>
                                    <TableCell>{commentduration}</TableCell>
                                    {/* <TableCell>{commentDuration && commentDuration}</TableCell> */}

                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            )
        } else if (selectedReportType === "timesheetpending") {
            return (
                <Table bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={missingUserPageNo}
                            total={missingUserPages}
                            onChange={(page) => setMissingUserPageNo(page)}
                        />
                    </div>
                }
                    topContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                //   key={missingUserPageNo}
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={missingUserPageNo}
                                total={missingUserPages}
                                onChange={(page) => setMissingUserPageNo(page)}
                            />
                        </div>
                    }
                    isHeaderSticky
                    isStriped
                    aria-label="Summary Report table" >
                    <TableHeader>
                        <TableColumn > Sr No.</TableColumn>
                        <TableColumn> User Name  </TableColumn>
                        <TableColumn className='text-center'> Total Task  </TableColumn>
                        <TableColumn className='text-center'> Open status  </TableColumn>
                        <TableColumn className='text-center'> In Process Status  </TableColumn>
                        <TableColumn className='text-center'> Closed Status  </TableColumn>
                        <TableColumn className='text-center'> Hold Status  </TableColumn>

                    </TableHeader>
                    <TableBody>
                        {missingUserItems.map((task: any, index: any) => {

                            return (
                                <TableRow key={index}>
                                    <TableCell >{((missingUserPageNo - 1) * rowsPerPage) + (index + 1)}</TableCell>
                                    <TableCell>{task?.label}</TableCell>
                                    <TableCell className='text-center'>{task.count?.totaltask}</TableCell>
                                    <TableCell className='text-center'>{task.count?.opentask}</TableCell>
                                    <TableCell className='text-center'>{task.count?.inprosesstask}</TableCell>
                                    <TableCell className='text-center'>{task.count?.closetask}</TableCell>
                                    <TableCell className='text-center'>{task.count?.holdTask}</TableCell>

                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>)
        }
    }

    const handleReportData = () => {

        if (selectedReportType === "summary") {

            fetchData()
        } else if (selectedReportType === "taskreport") {
            fetchTaskReportData()

        } else if (selectedReportType === "timesheetreport") {
            fetchTimesheetData()
        } else if (selectedReportType === "timesheetpending") {

            getMissingUserData()
        }

    }

    const handleExportData = () => {
        if (selectedReportType === "summary") {
            exportToCSVSummaryData()
        } else if (selectedReportType === "taskreport") {
            exportToCSVTaskReportData()
        } else if (selectedReportType === "timesheetreport") {
            exportToCSVTimesheetData() 
        }
        else if (selectedReportType === "timesheetpending") {
             exportToCSVMissinguserReport()
        }
        
    }

    function truncateText(text: string | undefined, maxLength: number) {
        if (text && text.length <= maxLength) {
            return text;
        } else {
            return text ? text.slice(0, maxLength) + "..." : "";
        }
    }

    return (
        <div className='flex flex-col pl-5 w-full'>
            <Breadcrumbs classNames={{
                list: "bg-slate-600",
            }}
                itemClasses={{
                    item: "text-white",
                    separator: "text-white",
                }} variant='solid' className='mt-4'>
                <BreadcrumbItem onClick={() => router.push("/taskapp/reports")} >Reports</BreadcrumbItem>

            </Breadcrumbs>
            <div className='flex flex-row mt-4 gap-2'>
                <div className='flex flex-row basis-[49%]  gap-2 '>
                    <label className='font-bold w-36 flex flex-row justify-end'>Products: </label>
                    <div className='flex flex-row justify-start'>
                        <Select
                            options={productsList}
                            isMulti
                            value={filters.products}
                            onChange={(value) => {
                                setFilters({ ...filters, products: value })
                            }}
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className='flex flex-row basis-[49%] gap-2'>
                    <label className='font-bold w-36 flex flex-row justify-end'>Projects: </label>
                    <div className='flex flex-row justify-start'>
                        <Select
                            options={projectsList}
                            isMulti
                            value={filters.projects}
                            onChange={(value) => {
                                setFilters({ ...filters, projects: value })
                            }}
                            styles={customStyles}
                        />
                    </div>
                </div>
            </div>

            <div className='flex flex-row mt-4  gap-2 justify-start'>
                <div className='flex flex-row basis-[49%]  gap-2 justify-start'>
                    <label className='font-bold w-36 flex flex-row justify-end'>Clients: </label>
                    <div className='flex flex-row justify-end'>
                        <Select
                            options={clientsList}
                            isMulti
                            value={filters.clients}
                            onChange={(value) => {
                                setFilters({ ...filters, clients: value })
                            }}
                            styles={customStyles}
                        />
                    </div>
                </div>
                <div className='flex flex-row basis-[49% gap-2 justify-start]'>
                    <label className='font-bold w-36 flex flex-row justify-end'>Project Leads: </label>
                    <div className='flex flex-row justify-end'>
                        <Select
                            options={projectleads}
                            isMulti
                            value={filters.projectleads}
                            onChange={(value) => {
                                setFilters({ ...filters, projectleads: value })
                            }}
                            styles={customStyles}
                        />
                    </div>
                </div>
            </div>

            <div className='flex flex-row mt-4  gap-2 justify-start'>
                <div className='flex flex-row basis-[49%]  gap-2 justify-start'>
                    <label className='font-bold w-36 flex flex-row justify-end'>Assignee: </label>
                    <div className='flex flex-row justify-end'>
                        <Select
                            options={assignees}
                            isMulti
                            value={filters.assignees}
                            onChange={(value) => {
                                setFilters({ ...filters, assignees: value })
                            }}
                            styles={customStyles}
                        />
                        {/* <Select
                            options={billingType}
                            isMulti
                            value={filters.billingtype}
                            onChange={(value) => {
                                setFilters({ ...filters, billingtype: value })
                            }}
                            styles={customStyles}
                        /> */}
                    </div>
                </div>
                <div className='flex flex-row basis-[49% gap-2 justify-start]'>
                    <label className='font-bold w-36 flex flex-row justify-end'>Status: </label>
                    <div className='flex flex-row justify-end'>
                        <Select
                            options={status}
                            isMulti
                            value={filters.status}
                            onChange={(value) => {
                                setFilters({ ...filters, status: value })
                            }}
                            styles={customStyles}
                        />
                    </div>
                </div>
            </div>

            <div className='flex flex-row mt-4  gap-2 justify-start'>
                <div className='flex flex-row basis-[49%]  gap-2 justify-start'>
                    <label className='font-bold w-36 flex flex-row justify-end'>Date From: </label>
                    <div className='flex flex-row justify-end'>
                        <Datetime dateFormat="DD-MM-YYYY" timeFormat={false} isValidDate={isValidDate} closeOnSelect className='border border-slate-400 rounded w-full px-2 py-2' value={moment(filters.fromdate).isValid() ? filters.fromdate : ""} onChange={(date) => setFilters((prevstate) => ({ ...prevstate, fromdate: date }))} />
                    </div>
                </div>
                <div className='flex flex-row basis-[49% gap-2 justify-start]'>
                    <label className='font-bold w-36 flex flex-row justify-end'>To Date: </label>
                    <div className='flex flex-row justify-end'>
                        <Datetime dateFormat="DD-MM-YYYY" timeFormat={false} isValidDate={isValidDate} closeOnSelect className='border border-slate-400 rounded w-full px-2 py-2' value={moment(filters.todate).isValid() ? filters.todate : ""} onChange={(date) => setFilters((prevstate) => ({ ...prevstate, todate: date }))} />
                    </div>
                </div>
            </div>



            <div className='flex flex-row justify-center mt-4 gap-3'>
                <select value={selectedReportType} onChange={(e) => setSelectedReportType(e.target.value)} className='border border-slate-400 px-2 py-1 outline-none rounded'>
                    <option selected value="summary">Summary Report</option>
                    {/* <option value="taskreport">Task Report</option> */}
                    <option value="timesheetreport">Time Sheet Report</option>
                    <option value="timesheetpending">Time Sheet Pending User List</option>
                </select>
                <Button className='bg-sky-600 text-white px-3 py-1 rounded' onClick={handleReportData}>Get Reports</Button>
            </div>
            <div className='flex flex-row justify-end pr-5  w-auto '>
                {((selectedReportType === "summary" && summarydata.length > 0) || (selectedReportType === "taskreport" && taskReports.length > 0) || (selectedReportType === "timesheetreport" && timesheetdata.length > 0) || (selectedReportType === "timesheetpending" && missingUserData.length > 0)) && <Button onClick={handleExportData} className='bg-sky-500 text-white rounded px-2 py-1 flex flex-row items-center gap-2 my-3'><span>Download Report</span><IoMdDownload /></Button>}
            </div>
            <div className='flex flex-row justify-center mt-4 w-auto mb-10 '>
                {tableData()}

            </div>
        </div>

    )
}

export default ReportsPage
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
import { jwtDecode } from "jwt-decode";

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
}



interface IBillableType {
    label?: string;
    value?: string;
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

interface ILoginUser {
    fullname: string;
    role: string;
    id: number;
    username: string;
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
    const [selectedReportType, setSelectedReportType] = useState<string>("timesheetreport")
    const router = useRouter();
    const [summaryPageNo, setsummaryPageNo] = useState(1)
    const [timeSheetPageNo, setTimeSheetPageNo] = useState(1)


    const [user, setUser] = useState<ILoginUser>({
        fullname: "",
        role: "user",
        id: 0,
        username: ""
    })

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

     


    const rowsPerPage = 20;

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

    const fetchTimesheetData = async () => {
        try {
            let newFilters = {
                assignees: user.fullname,
                fromdate: moment(filters.fromdate).format('YYYY-MM-DD'),
                todate: moment(filters.todate).format('YYYY-MM-DD'),
            }
            const { data } = await axiosinstance.get(`${apiUrl}/api/task/usertimesheetwithcomments`, { params: newFilters });
            if (data.success) {
                setTimesheetdata(data.data)

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
                // ["Comment Id"]: report.commentid,
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


    const tableData = () => {
        if (selectedReportType === "timesheetreport") {

            return (
                <Table isHeaderSticky isStriped aria-label="Timesheet table" className='w-full overflow-auto max-h-screen'
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
                        <TableColumn className='bg-slate-300'>Sr No.</TableColumn>
                        <TableColumn className='bg-slate-300'>Task Id</TableColumn>
                        <TableColumn className='bg-slate-300'>Task Create Date</TableColumn>
                        <TableColumn className='bg-slate-300'>Client Code</TableColumn>
                        <TableColumn className='bg-slate-300'> Client Name  </TableColumn>
                        <TableColumn className='bg-slate-300'>PO Date</TableColumn>
                        <TableColumn className='bg-slate-300'>Product Name</TableColumn>
                        {/* <TableColumn>Project Code</TableColumn>
                        <TableColumn>Project Category</TableColumn> */}
                        <TableColumn className='bg-slate-300'>Project</TableColumn>
                        <TableColumn className='bg-slate-300'>Task Type </TableColumn>
                        <TableColumn className='bg-slate-300'>Task Descriptions</TableColumn>
                        <TableColumn className='bg-slate-300'>Billing Type</TableColumn>
                        <TableColumn className='bg-slate-300'>Project Lead</TableColumn>
                        <TableColumn className='bg-slate-300'>Priority</TableColumn>
                        <TableColumn className='bg-slate-300'>Assignee</TableColumn>
                        <TableColumn className='bg-slate-300'>Assign Date</TableColumn>
                        <TableColumn className='bg-slate-300'>Actual Start Date</TableColumn>
                        <TableColumn className='bg-slate-300'>Due Date</TableColumn>
                        <TableColumn className='bg-slate-300'>Completion Date</TableColumn>
                        <TableColumn className='bg-slate-300'>Status</TableColumn>
                        <TableColumn className='bg-slate-300'>Task Duration</TableColumn>
                        <TableColumn className='bg-slate-300'>Remark</TableColumn>
                        <TableColumn className='bg-slate-300'>Comment</TableColumn>
                        {/* <TableColumn>Comment Id</TableColumn> */}
                        <TableColumn className='bg-slate-300'>Comment Start Time</TableColumn>
                        <TableColumn className='bg-slate-300'>Comment End Time</TableColumn>
                        <TableColumn className='bg-slate-300'>Timesheet Duration</TableColumn>

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
                                    {/* <TableCell>{task.commentid}</TableCell> */}
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
        }
    }


    const handleReportData = () => {

        fetchTimesheetData()
    }

    const handleExportData = () => {
        if (selectedReportType === "timesheetreport") {
            exportToCSVTimesheetData()
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






            <div className='flex flex-row mt-4  gap-2 justify-start'>
                <div className='flex gap-2'>
                    <label className='font-bold w-36 flex flex-row justify-end mt-3'>Date From: </label>
                    <div className='flex flex-row justify-end'>
                        <Datetime dateFormat="DD-MM-YYYY" timeFormat={false} isValidDate={isValidDate} closeOnSelect className='border border-slate-400 rounded w-full px-2 py-2' value={moment(filters.fromdate).isValid() ? filters.fromdate : ""} onChange={(date) => setFilters((prevstate) => ({ ...prevstate, fromdate: date }))} />
                    </div>
                </div>
                <div className='flex gap-2'>
                    <label className='font-bold w-36 flex flex-row justify-end mt-3'>To Date: </label>
                    <div className='flex flex-row justify-end'>
                        <Datetime dateFormat="DD-MM-YYYY" timeFormat={false} isValidDate={isValidDate} closeOnSelect className='border border-slate-400 rounded w-full px-2 py-2' value={moment(filters.todate).isValid() ? filters.todate : ""} onChange={(date) => setFilters((prevstate) => ({ ...prevstate, todate: date }))} />
                    </div>
                </div>

                <div className='flex flex-row justify-center ml-11 gap-3'>
                    <Button className='bg-sky-600 text-white px-3 py-1 rounded' onClick={handleReportData}>Get Reports</Button>
                </div>
            </div>




            <div className='flex flex-row justify-end pr-5  w-auto '>
                {((selectedReportType === "summary" && summarydata.length > 0) || (selectedReportType === "taskreport" && taskReports.length > 0) || (selectedReportType === "timesheetreport" && timesheetdata.length > 0)) && <Button onClick={handleExportData} className='bg-sky-500 text-white rounded px-2 py-1 flex flex-row items-center gap-2 my-3'><span>Download Report</span><IoMdDownload /></Button>}
            </div>
            <div className='flex flex-row justify-center mt-4 w-auto mb-10 '>
                {tableData()}

            </div>
        </div>

    )
}

export default ReportsPage
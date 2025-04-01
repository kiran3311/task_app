'use client'
import { axiosinstance } from '@/app/libs/axiosinstance';
import { apiUrl, appURL } from '@/config';
import React, { useState, useEffect, useRef } from 'react'
import { RiFileExcel2Line } from "react-icons/ri";

import * as XLSX from 'xlsx';
import "react-datetime/css/react-datetime.css";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";

import Datetime from 'react-datetime';
import { useRouter } from 'next/navigation';
import { DatePicker, Stack } from 'rsuite';
import { FaCalendar, FaClock } from 'react-icons/fa';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { Button } from "@nextui-org/react";
import axios from 'axios';

interface ISalarySlip {
    ID?: number;
    STATEMENTDATE?: Date | null,
    EMPCODE: string;
    EPFUANNO?: string;
    ESICNO?: string;
    GENDER?: string;
    DOB?: string;
    PAN?: string;
    AADHAAR?: string;
    MEDICLAIMNO?: string;
    EMPLOYEENAME?: string;
    DOJ?: string;
    STATUS?: string;
    DOE?: string;
    TEAM?: string;
    DESIGNATION?: string;
    LEAVEOPBALANCE?: string;
    LEAVEADDITION?: string;
    PRESENTDAYS?: string;
    WOFF?: string;
    LALEAVENTAKEN?: string;
    ABSENTDAYS?: string;
    HALFDAY?: string;
    COMPOFF?: string;
    WFH?: string;
    PAIDDAYS?: string;
    LEAVECF?: string;
    BASICSTRUCTURE?: string;
    HRASTRUCTURE?: string;
    CONVSTRUCTURE?: string;
    MEDSTRUCTURE?: string;
    EDUSTRUCTURE?: string;
    CCASTRUCTURE?: string;
    GROSSPMSTRUCTURE?: string;
    BASIC?: string;
    HRA?: string;
    CONV?: string;
    MED?: string;
    EDU?: string;
    CCA?: string;
    INCENTIVES?: string;
    OTHERARREARS?: string;
    TOTALCALCULATEDGROSSASPERPRESENDAYS?: string;
    PT?: string;
    PF?: string;
    ESIC?: string;
    TDS?: string;
    LWF?: string;
    OTHERDEDUCTION?: string;
    TOTALDEDUCTION?: string;
    NETSALARY?: string;
    WFHDEDUCTION?: string;
    NETSALARYINHAND?: string;
    PAYMENTMODE?: string;
    MONTH?: string;
    GRATUITYPM?: string;
    MEDICLAIMPM?: string;
    EMPLOYERPFPM?: string;
    EMPLOYERESIC?: string;
    CTCPM?: string;
    CTCPA?: string;
    BONUS?: string;
    GRATUITYPMSTRUCTURE?: string;
    MEDICLAIMPMSTRUCTURE?: string;
    EMPLOYERPFPMSTRUCTURE?: string;
    EMPLOYERESICSTRUCTURE?: string;
    TOTALSTRUCTURE?: string;
    CTCSTRUCTURE?: string;
    CREATEDAT?: Date,
    UPDATEDAT?: Date,
}


function ReportsPage() {
    const router = useRouter();
    const [salarySlips, setSalarySlips] = useState<ISalarySlip[]>([]); // Store 
    // Function to handle file upload
    const [statementDate, setStatementDate] = useState<Date | null | undefined>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [excelFile, setExcelFile] = useState<File | undefined>(undefined)
    const [loading, setLoading] = useState(false);


    const formatDateUsedByExcel = (dateByExcel: any) => {
        const baseDate = new Date(1900, 0, 1);

        // Adding the serial number (subtracting 2 because Excel's serial date system starts from 1).
        const date = new Date(baseDate.setDate(baseDate.getDate() + dateByExcel - 2));

        // Now, format the date to "DD-MM-YYYY"
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate
    }

    const onChangeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setExcelFile(file)
    }

    const handleFileUpload = async () => {
        try {
            if (!statementDate) {
                alert("Please select a statement date")
                return false
            }
            if (!excelFile) {
                alert("Please select an excel file")
                return false
            }

            // debugger

            if (excelFile) {
                setLoading(true)
                const reader = new FileReader();
                reader.onload = async (event: ProgressEvent<FileReader>) => {
                    // Parse the data when the file is loaded
                    const binaryStr = event.target?.result;
                    if (binaryStr instanceof ArrayBuffer) {
                        const wb = XLSX.read(binaryStr, { type: "binary" });
                        const wsname = wb.SheetNames[0]; // Get the first sheet
                        const ws = wb.Sheets[wsname];

                        // Convert sheet data to JSON with column numbers as keys
                        const sheetData = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Read all rows as arrays

                        // Remove the header row (skip the first row in the data)
                        const dataWithoutHeader = sheetData.slice(1); // Removes the first row (header)

                        // Map into ISalarySlip objects
                        const formattedData: ISalarySlip[] = dataWithoutHeader.map((row: any) => {

                            const rowObject: ISalarySlip = {
                                EMPCODE: row[1] != null && row[1] !== undefined ? row[1].toString() : "",
                                STATEMENTDATE: (statementDate != null && statementDate !== undefined) ? statementDate : new Date(), // Safely convert to string
                                EPFUANNO: row[2] != null && row[2] !== undefined ? row[2].toString() : "", // Safely convert to string
                                ESICNO: row[3] != null && row[3] !== undefined ? row[3].toString() : "", // Safely convert to string
                                GENDER: row[4] != null && row[4] !== undefined ? row[4].toString() : "", // Safely convert to string
                                DOB: row[5] != null && row[5] !== undefined ? row[5].toString() : "", // Safely convert to string
                                PAN: row[6] != null && row[6] !== undefined ? row[6].toString() : "", // Safely convert to string
                                AADHAAR: row[7] != null && row[7] !== undefined ? row[7].toString() : "", // Safely convert to string
                                MEDICLAIMNO: row[8] != null && row[8] !== undefined ? row[8].toString() : "", // Safely convert to string
                                EMPLOYEENAME: row[9] != null && row[9] !== undefined ? row[9].toString() : "", // Safely convert to string
                                DOJ: row[10] != null && row[10] !== undefined ? formatDateUsedByExcel(row[10]) : "", // Safely convert to string
                                STATUS: row[11] != null && row[11] !== undefined ? row[11].toString() : "", // Safely convert to string
                                DOE: row[12] != null && row[12] !== undefined ? row[12].toString() : "", // Safely convert to string
                                TEAM: row[13] != null && row[13] !== undefined ? row[13].toString() : "", // Safely convert to string
                                DESIGNATION: row[14] != null && row[14] !== undefined ? row[14].toString() : "", // Safely convert to string
                                LEAVEOPBALANCE: row[15] != null && row[15] !== undefined ? row[15].toString() : "", // Safely convert to string
                                LEAVEADDITION: row[16] != null && row[16] !== undefined ? row[16].toString() : "", // Safely convert to string
                                PRESENTDAYS: row[17] != null && row[17] !== undefined ? row[17].toString() : "", // Safely convert to string
                                WOFF: row[18] != null && row[18] !== undefined ? row[18].toString() : "", // Safely convert to string
                                LALEAVENTAKEN: row[19] != null && row[19] !== undefined ? row[19].toString() : "", // Safely convert to string
                                ABSENTDAYS: row[20] != null && row[20] !== undefined ? row[20].toString() : "", // Safely convert to string
                                HALFDAY: row[21] != null && row[21] !== undefined ? row[21].toString() : "", // Safely convert to string
                                COMPOFF: row[22] != null && row[22] !== undefined ? row[22].toString() : "", // Safely convert to string
                                WFH: row[23] != null && row[23] !== undefined ? row[23].toString() : "", // Safely convert to string
                                PAIDDAYS: row[24] != null && row[24] !== undefined ? row[24].toString() : "", // Safely convert to string
                                LEAVECF: row[25] != null && row[25] !== undefined ? row[25].toString() : "", // Safely convert to string
                                BASICSTRUCTURE: row[26] != null && row[26] !== undefined ? row[26].toString() : "", // Safely convert to string
                                HRASTRUCTURE: row[27] != null && row[27] !== undefined ? row[27].toString() : "", // Safely convert to string
                                CONVSTRUCTURE: row[28] != null && row[28] !== undefined ? row[28].toString() : "", // Safely convert to string
                                MEDSTRUCTURE: row[29] != null && row[29] !== undefined ? row[29].toString() : "", // Safely convert to string
                                EDUSTRUCTURE: row[30] != null && row[30] !== undefined ? row[30].toString() : "", // Safely convert to string
                                CCASTRUCTURE: row[31] != null && row[31] !== undefined ? row[31].toString() : "", // Safely convert to string
                                GROSSPMSTRUCTURE: row[32] != null && row[32] !== undefined ? row[32].toString() : "", // Safely convert to string
                                BASIC: row[33] != null && row[33] !== undefined ? row[33].toString() : "", // Safely convert to string
                                HRA: row[34] != null && row[34] !== undefined ? row[34].toString() : "", // Safely convert to string
                                CONV: row[35] != null && row[35] !== undefined ? row[35].toString() : "", // Safely convert to string
                                MED: row[36] != null && row[36] !== undefined ? row[36].toString() : "", // Safely convert to string
                                EDU: row[37] != null && row[37] !== undefined ? row[37].toString() : "", // Safely convert to string
                                CCA: row[38] != null && row[38] !== undefined ? row[38].toString() : "", // Safely convert to string
                                INCENTIVES: row[39] != null && row[39] !== undefined ? row[39].toString() : "", // Safely convert to string
                                OTHERARREARS: row[40] != null && row[40] !== undefined ? row[40].toString() : "", // Safely convert to string
                                TOTALCALCULATEDGROSSASPERPRESENDAYS: row[41] != null && row[41] !== undefined ? row[41].toString() : "", // Safely convert to string
                                PT: row[42] != null && row[42] !== undefined ? row[42].toString() : "", // Safely convert to string
                                PF: row[43] != null && row[43] !== undefined ? row[43].toString() : "", // Safely convert to string
                                ESIC: row[44] != null && row[44] !== undefined ? row[44].toString() : "", // Safely convert to string
                                TDS: row[45] != null && row[45] !== undefined ? row[45].toString() : "", // Safely convert to string
                                LWF: row[46] != null && row[46] !== undefined ? row[46].toString() : "", // Safely convert to string
                                OTHERDEDUCTION: row[47] != null && row[47] !== undefined ? row[47].toString() : "", // Safely convert to string
                                TOTALDEDUCTION: row[48] != null && row[48] !== undefined ? row[48].toString() : "", // Safely convert to string
                                NETSALARY: row[49] != null && row[49] !== undefined ? row[49].toString() : "", // Safely convert to string
                                WFHDEDUCTION: row[50] != null && row[50] !== undefined ? row[50].toString() : "", // Safely convert to string
                                NETSALARYINHAND: row[51] != null && row[51] !== undefined ? row[51].toString() : "", // Safely convert to string
                                PAYMENTMODE: row[52] != null && row[52] !== undefined ? row[52].toString() : "", // Safely convert to string
                                MONTH: row[53] != null && row[53] !== undefined ? row[53].toString() : "", // Safely convert to string
                                GRATUITYPM: row[54] != null && row[54] !== undefined ? row[54].toString() : "", // Safely convert to string
                                MEDICLAIMPM: row[55] != null && row[55] !== undefined ? row[55].toString() : "", // Safely convert to string
                                EMPLOYERPFPM: row[56] != null && row[56] !== undefined ? row[56].toString() : "", // Safely convert to string
                                EMPLOYERESIC: row[57] != null && row[57] !== undefined ? row[57].toString() : "", // Safely convert to string
                                CTCPM: row[58] != null && row[58] !== undefined ? row[58].toString() : "", // Safely convert to string
                                CTCPA: row[59] != null && row[59] !== undefined ? row[59].toString() : "", // Safely convert to string
                                BONUS: row[60] != null && row[60] !== undefined ? row[60].toString() : "", // Safely convert to string
                                GRATUITYPMSTRUCTURE: row[61] != null && row[61] !== undefined ? row[61].toString() : "", // Safely convert to string
                                MEDICLAIMPMSTRUCTURE: row[62] != null && row[62] !== undefined ? row[62].toString() : "", // Safely convert to string
                                EMPLOYERPFPMSTRUCTURE: row[63] != null && row[63] !== undefined ? row[63].toString() : "", // Safely convert to string
                                EMPLOYERESICSTRUCTURE: row[64] != null && row[64] !== undefined ? row[64].toString() : "", // Safely convert to string
                                TOTALSTRUCTURE: row[65] != null && row[65] !== undefined ? row[65].toString() : "", // Safely convert to string
                                CTCSTRUCTURE: row[66] != null && row[66] !== undefined ? row[66].toString() : "", // Safely convert to string
                                CREATEDAT: new Date(),
                                UPDATEDAT: new Date()
                            };

                            return rowObject;
                        });


                        setSalarySlips(formattedData); // Store parsed data in state
                        try {
                          
                            const endpoint = `${apiUrl}/api/salaryslip/uploadsalary`
                            const { data } = await axiosinstance.post(endpoint, formattedData)
                            fileInputRef.current = null;
                            if (data.success) {
                                alert("Uploaded Excel Successfully")
                                setLoading(false)
                                console.log(data)
                            }
                        } catch (error: any) {
                            console.log("Error in upload salary api ", error)
                            alert("Error in upload please try again")
                            setLoading(false)
                        }


                    }
                };
                reader.readAsArrayBuffer(excelFile);
            }
        } catch (error: any) {
            console.log("ERROR : ", error)
            alert("Error in upload please try again")
            setLoading(false)
        }
    }

    const handleDateChange = (date: Date | null) => {
        setStatementDate(date)
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
                <BreadcrumbItem onClick={() => router.push("/taskapp/uploadsalary")} >Upload Salary</BreadcrumbItem>
            </Breadcrumbs>
            <div className='flex flex-row gap-6 justify-center w-full  mt-16'></div>
            <div className='flex flex-col gap-6 justify-center   mt-4'>
                <div className='w-52'>
                    <a className='flex flex-row bg-sky-600 text-white px-3 py-1 pl-6 rounded items-center' href={`${appURL}/files/Salary_Template.xlsx`}>  Download Template <span className='mx-2'><RiFileExcel2Line /></span></a>
                </div>

                <div className='flex flex-row gap-4'>
                    <DatePicker format="MMM yyyy" caretAs={BsCalendar2MonthFill} onChange={handleDateChange} />

                    <input type="file" accept=".xlsx,.xls" onChange={(e: any) => onChangeFileUpload(e)} placeholder='Choose Excel File' />

                </div>
                <div>
                    {!loading && (<Button onClick={handleFileUpload} className='bg-sky-600 text-white px-3 py-1 rounded' type="button">
                        Upload Excel
                    </Button>)}
                    {loading && (<Button onClick={handleFileUpload} isLoading className='bg-sky-600 text-white px-3 py-1 rounded' type="button">
                        Uploading...
                    </Button>)}
                </div>



            </div>
        </div>

    )
}

export default ReportsPage
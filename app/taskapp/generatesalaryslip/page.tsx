'use client'

import { axiosinstance } from '@/app/libs/axiosinstance'
import { apiUrl } from '@/config'
import React, { useState, useEffect, useRef } from 'react'
import AdroitpdfLogo from '@/public/images/pdflogo.png'
import "react-datetime/css/react-datetime.css";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { DatePicker, Stack } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import makeAnimated from 'react-select/animated';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@nextui-org/react";


interface ISalarySlip {
    ID?: number;
    STATEMENTDATE?: Date | null,
    EMPCODE?: string;
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

// attributes: ['ID', 'name', "EMPCODE", "EMPLOYEENAME"],

interface IEmployee {
    label?: string;
    value?: string;
}


const animatedComponents = makeAnimated();

function GenerateSalarySlipPage() {
    const router = useRouter();
    const [salarySlips, setSalarySlips] = useState<ISalarySlip[]>([]);
    // const [currentSalarySlipToDownload, setCurrentSalarySlipToDownload] = useState<ISalarySlip>({})
    const [statementDate, setStatementDate] = useState<any>(new Date())
    const [employees, setEmployees] = useState<IEmployee[]>([])
    const [employeesFilter, setEmployeesFilter] = useState<readonly IEmployee[]>([])
    const tableRefs = useRef<(HTMLTableElement | null)[]>([]);
    const [allValue, setAllValues] = useState<any>("")
    const [zipBlob, setZipBlob] = useState<Blob | null>(null);
    const [isZipReady, setIsZipReady] = useState(false);
    const [loader, setLoader] = useState(false)
    const [optcount, setOptcount] = useState(0)

    const customStyles = {
        container: (base: any) => ({
            ...base,
            width: '350px',
        }),
    }
    useEffect(() => {
        async function getEmployeesOnStatementDate() {
            try {
                const { data } = await axiosinstance.get(`${apiUrl}/api/salaryslip/getemployeeonstatementdate/${statementDate}`)

                if (data?.success) {
                    //console.log("Updated changed in emp data----",data.data)
                    setEmployees(data.data)
                }
            } catch (error: any) {
                console.log("Error in getEmployeesOnStatementDate : ", error)
            }
        }
        getEmployeesOnStatementDate();
    }, [statementDate])







    useEffect(() => {

        // Trigger PDF generation only after salarySlips data has been set and tables are rendered
        if (salarySlips.length > 0) {
            salarySlips.forEach((salarySlip, index) => {
                // Step 3: Check if the table for this salary slip is rendered
                const table = tableRefs.current[index]; // Access the table using the index
                if (table) {
                    // Ensure the table is rendered before generating PDF
                    generatePdf(salarySlip, table);

                }
            });
        }
    }, [salarySlips]); // Re-run this effect when salarySlips changes

    useEffect(() => {
        if (employeesFilter.length > 0) {
            fetchData(); // Call function after employeesFilter updates
        }
    }, [employeesFilter])



    // const downloadAll = async (option: any) => {
    //     fetchData()
    //     if (salarySlips.length === 0 || option !== "All") return;

    //     const zip = new JSZip();
    //     const pdfPromises = salarySlips.map(async (salarySlip, index) => {
    //         const table = tableRefs.current[index]; // Get the table element
    //         if (!table) return;

    //         const pdfBlob = await generatePdf(salarySlip, table); // Generate PDF
    //         zip.file(`SalarySlip_${salarySlip.EMPCODE || index}.pdf`, pdfBlob); // Add to ZIP
    //     });

    //     await Promise.all(pdfPromises); // Wait for all PDFs to be generated

    //     zip.generateAsync({ type: "blob" }).then((zipBlob) => {
    //         saveAs(zipBlob, "SalarySlips.zip"); // Download ZIP
    //     });
    // };
    const getMonthYear = (dateString: string): string => {
        const date = new Date(dateString); // Convert string to Date object
        const month = date.toLocaleString("en-US", { month: "long" }); // Get full month name
        const year = date.getFullYear(); // Get year

        return `${month}_${year}`;
    }

    const getZipName = getMonthYear(statementDate)

    const downloadAll = async () => {


        try {


            if (!allValue) {
                window.alert("Please Select Option")
                //  setLoader(false)
                return false
            }

            // Ensure data is loaded

            //if (salarySlips.length === 0 || option !== "All") return;
             fetchData();
            if (salarySlips.length === 0) {
                //  setLoader(false)
                return;
            }

            // setIsZipReady(false); // Reset state
            // setZipBlob(null);
            setLoader(true)
            const zip = new JSZip();
            const pdfPromises = salarySlips.map(async (salarySlip, index) => {
                const table = tableRefs.current[index]; // Get the table element
                if (!table) return;
               // setLoader(true)
                const pdfBlob = await generatePdf(salarySlip, table); // Generate PDF
                zip.file(`${salarySlip.EMPCODE || index}_${salarySlip.EMPLOYEENAME}.pdf`, pdfBlob); // Add to ZIP
            });

            await Promise.all(pdfPromises); // Wait for all PDFs to be generated

            zip.generateAsync({ type: "blob" }).then((zipFile) => {
                setZipBlob(zipFile); // Store ZIP file in state
                setIsZipReady(true); // Show download button
                setLoader(false)
                //downloadZipFile()
            });
           
        } catch (error) {
            console.log("Error in Generate PDF into zip :", error)
        } 

    };


    useEffect(()=>{
        downloadZipFile()

    },[zipBlob])
    // Function to download the ZIP when the button is clicked
    const downloadZipFile = () => {
        if (zipBlob) {
            saveAs(zipBlob, `SalarySlip_${getZipName}.zip`);
        }
        setIsZipReady(false);
        setSalarySlips([])
        setEmployeesFilter([])
    };

    function numberToWords(num: any) {
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        const thousands = ["", "Thousand", "Million", "Billion"];

        if (num === 0) return "Zero";

        let words = '';
        let thousandIndex = 0;

        // Break the number into chunks of three digits
        while (num > 0) {
            let chunk = num % 1000;
            if (chunk > 0) {
                words = convertChunk(chunk) + (thousands[thousandIndex] ? " " + thousands[thousandIndex] : "") + " " + words;
            }
            num = Math.floor(num / 1000);
            thousandIndex++;
        }

        return words.trim() + " Only";
    }

    const convertChunk = (num: any): any => {
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        if (num === 0) return "";

        if (num < 20) {
            return ones[num];
        } else if (num < 100) {
            return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + ones[num % 10] : "");
        } else {
            return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + convertChunk(num % 100) : "");
        }
    }



    //convert logo into base 64  
    const getBase64ImageFromUrl = async (imageUrl: string) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const fetchData = async () => {
        try {
            const date = new Date(statementDate);

            const year = date.getFullYear();
            const month = date.getMonth();

            const startOfTheMonth = new Date(year, month, 1);
            startOfTheMonth.setHours(0, 0, 0, 0);

            const startOfTheNextMonth = new Date(year, month + 1, 1);
            startOfTheNextMonth.setHours(0, 0, 0, 0);


            let newFilters = {
                employeesFilter: employeesFilter.map(f => f.value),
                statementDate: statementDate
            }


            const { data } = await axiosinstance.get(`${apiUrl}/api/salaryslip/getsalaryslip`, { params: newFilters });
            if (data.success) {
                setSalarySlips(data.data)

            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setSalarySlips([])
        }
    };
    const handleDateChange = (date: Date | null) => {
        setStatementDate(date)
        setEmployeesFilter([])

    }



    const getMonthFromStatementDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { month: 'long' }); // Returns full month name (e.g., "January")
    };

    // const result = salarySlips.map(item => (getMonthFromStatementDate(item.STATEMENTDATE)));

    const result = getMonthFromStatementDate(statementDate)
    console.log("Result month ", result)


    const setupTable = (pdf: any,
        table: HTMLTableElement,
        tableName: string,
        startY: number,
        columnBoldIndex: number[],
        boldRowsIndex: number[],
        alignLeftToColumnIndex: number[],
        alignRightToColumnIndex: number[],
        rowsWithBorders: number[] // New parameter to specify the rows that need borders
    ) => {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const leftRightGap = 10; // Define some left-right gap (in mm or pts)
        const totalPercentageWidth = 100; // Total width percentage (100%)
        const remainingWidth = pageWidth - 2 * leftRightGap; // Remaining width after gaps
        const midXpos = 0;
        let xPosTable = 0
        let totalColumnX = 0
        let verticalLineX1 = 0;
        let verticalLineX2 = 0;
        let verticalLineY1 = 0;
        let verticalLineY2 = 0;
        let tableHeight = 0; // Variable to store the height of the table

        if (table) {
            let totalColumnWidth = 0;
            const columnWidths: any = [];

            // Calculate column widths based on the width percentages
            Array.from(table.rows[0].cells).forEach((cell: any, index) => {
                const cellWidthPercentage = parseInt(cell.getAttribute('width'), 10);
                const cellWidth = (remainingWidth * cellWidthPercentage) / totalPercentageWidth;
                columnWidths.push({ index, width: cellWidth });
                totalColumnWidth += cellWidth;
            });

            Array.from(table.rows[6].cells).forEach((cell: any, index) => {

                const cellWidthPercentage = parseInt(cell.getAttribute('width'), 10);
                const cellWidth = (remainingWidth * cellWidthPercentage) / totalPercentageWidth;

                if ([0, 1, 2].includes(index)) totalColumnX += cellWidth;
            });

            xPosTable = (pageWidth - totalColumnWidth) / 2;

            const columnStyles = columnWidths.reduce((acc: any, { index, width }: any) => {
                acc[index] = { cellWidth: width };
                return acc;
            }, {});


            // Array to store row data
            let rowData: { index: number; x: number; y: number; width: number; height: number }[] = [];

            // Use autoTable to render the table with the adjusted column widths
            pdf.autoTable({
                html: table,
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 255, 255],
                    fontSize: 8,
                    fontStyle: 'helvetica',
                    lineWidth: 0, // No borders
                },
                bodyStyles: {
                    fillColor: [255, 255, 255],
                    fontSize: 8.5,
                    fontStyle: 'helvetica',
                    lineWidth: 0, // No borders
                    cellPadding: 1
                },
                tableLineWidth: 0, // Disable table borders
                tableLineColor: [255, 255, 255], // Set table line color to white (transparent)
                startY: startY, // Position the table below the text (adjust if necessary)
                startX: xPosTable, // Center the table horizontally
                columnStyles: columnStyles,
                didParseCell: (data: any) => {

                    const targetRow = 5
                    const targetCol = 1
                    //  data.cell.height += 3

                    // if ([ 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(data.row.index) && [1, 2, 7].includes(data.column.index)) {
                    //     data.cell.styles.halign = 'right'; // Apply right alignment
                    //     // data.cell.styles.cellPadding = {right: 1};

                    // }
 
                    if ([6].includes(data.row.index) && [1, 3, 7].includes(data.column.index)) {
                        data.cell.styles.halign = 'center'; // Apply right alignment
                        //data.cell.styles.cellPadding = {right: 2};

                    }

                    if ([6].includes(data.row.index) && [9].includes(data.column.index)) {
                        //data.cell.styles.halign = 'center'; // Apply right alignment
                        data.cell.styles.cellPadding = { left: 2 };

                    }

                    if ([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(data.row.index) && [1].includes(data.column.index)) {
                        data.cell.styles.halign = 'right';
                        data.cell.styles.cellPadding = { top: 1, right: 20 };
       
                    }


                    if ([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(data.row.index) && [2].includes(data.column.index)) {
                        data.cell.styles.halign = 'right';
                        data.cell.styles.cellPadding = { top: 1, right: 17 };

                    }

                    if ([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(data.row.index) && [7].includes(data.column.index)) {
                        data.cell.styles.halign = 'right';
                        data.cell.styles.cellPadding = { top: 1, right: 2 };

                    }

                    if ([6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(data.row.index)) {
                        data.cell.height = 4
                    }
                   


                    const currentColumn = data.column.index;
                    const currentRow = data.row.index;
                    data.cell.styles.textColor = [0, 0, 0];



                    // Bold specific rows
                    if (boldRowsIndex.includes(currentRow)) {
                        data.cell.styles.fontStyle = 'bold'; // Apply bold to the row
                    }

                    // Add border to the top and bottom of specific rows
                    // if (rowsWithBorders.includes(currentRow)) {
                    //     // Adding top border for the first row in the `rowsWithBorders` list
                    //     if (currentRow === rowsWithBorders[0]) {
                    //         data.cell.styles.borderColor = 'black';
                    //         data.cell.styles.lineWidth = 0.1; // Adjust thickness of the border
                    //         data.cell.styles.borderTop = true; // Add top border
                    //         data.cell.styles.borderBottom = false; // No bottom border
                    //         data.cell.styles.borderLeft = false; // No left border
                    //         data.cell.styles.borderRight = false; // No right border
                    //     }

                    //     // Adding bottom border for the last row in the `rowsWithBorders` list
                    //     if (currentRow === rowsWithBorders[rowsWithBorders.length - 1]) {
                    //         data.cell.styles.borderColor = 'black';
                    //         data.cell.styles.lineWidth = 0.1; // Adjust thickness of the border
                    //         data.cell.styles.borderBottom = true; // Add bottom border
                    //         data.cell.styles.borderTop = false; // No top border
                    //         data.cell.styles.borderLeft = false; // No left border
                    //         data.cell.styles.borderRight = false; // No right border
                    //     }

                    //     // You could also add similar conditions for any other specific rows you want to add borders to.
                    // }


                    /*
                   
      
                      // Adding table cell color to black
                     
      
                      // Bold specific columns
                      if (columnBoldIndex.includes(currentColumn)) {
                          data.cell.styles.fontStyle = 'bold';
                      }
      
                     
                      // Align specific column to left
                      if (alignLeftToColumnIndex.includes(currentColumn)) {
                          data.cell.styles.halign = 'left';
                      }
      
                      // Align specific column to right
                      if (alignRightToColumnIndex.includes(currentColumn)) {
                          data.cell.styles.halign = 'right';
                      }
                    */

                },
                didDrawPage: (data: any) => {

                    tableHeight = 0
                    let borderAboveSecondTableHeader = 0
                    let borderBelowSecondTableHeader = 0
                    let borderAboveThirdTableHeader = 0
                    let borderBelowThirdTableHeader = 0
                    const rowInTable = data.table.body
                    for (let i = 0; i < rowInTable.length; i++) {
                        tableHeight += rowInTable[i].height // full table height

                        if (i <= 5) borderAboveSecondTableHeader += rowInTable[i].height
                        if (i <= 6) borderBelowSecondTableHeader += rowInTable[i].height
                        if (i <= 20) borderAboveThirdTableHeader += rowInTable[i].height
                        if (i <= 21) borderBelowThirdTableHeader += rowInTable[i].height

                        if (i < 6) verticalLineX1 += (rowInTable[i].height)
                        if (i >= 6 && i <= 21) verticalLineX2 += (rowInTable[i].height)

                    }


                    const pageWidth = pdf.internal.pageSize.width;
                    /// const tableHeight = pdf.autoTable.previous.finalY; // Get the height of the table

                    // Adjust these values as necessary for margins
                    const margin = { top: 10, left: 10, right: 10, bottom: 0 };
                    // const outerBorderX = xPosTable + 3; // Slightly outside the table
                    const outerBorderX = xPosTable + 4
                    const outerBorderY = startY - 1; // Slightly above the table

                    pdf.setDrawColor(0); // Set color for outer border
                    pdf.rect(outerBorderX, outerBorderY, (pageWidth - margin.left - margin.right), (tableHeight + 2));
                    pdf.setDrawColor(0);
                    pdf.line(outerBorderX, startY + borderAboveSecondTableHeader, (pageWidth - margin.left + 4), startY + borderAboveSecondTableHeader)
                    pdf.line(outerBorderX, startY + borderBelowSecondTableHeader, (pageWidth - margin.left + 4), startY + borderBelowSecondTableHeader)
                    pdf.line(outerBorderX, startY + borderAboveThirdTableHeader, (pageWidth - margin.left + 4), startY + borderAboveThirdTableHeader)
                    pdf.line(outerBorderX, startY + borderBelowThirdTableHeader, (pageWidth - margin.left + 4), startY + borderBelowThirdTableHeader)

                    const offset = 15
                    const hello = {
                        x1: xPosTable + totalColumnX + offset,
                        y1: startY + verticalLineX1,
                        x2: xPosTable + totalColumnX + offset,
                        y2: startY + verticalLineX1 + verticalLineX2
                    }
                    console.log(hello)
                    pdf.line(hello.x1, hello.y1, hello.x2, hello.y2)

                },
                willDrawCell: function (data: any) {


                    console.log("Table data---- ", data)

                    if ([6, 21].includes(data.row.index)) {
                        pdf.setFillColor(169, 169, 169); // Example: Gray background

                        // Get the cell position and dimensions

                        const rowXStart = data.cell.x || 0;       // Starting X position of the row
                        const rowYStart = data.cell.y || 0;       // Starting Y position of the row
                        // const rowWidth = pdf.internal.pageSize.width -50

                        const rowHeight = data.cell.height || 10; // Height of the row
                        const rowWidth = 11
                        const tableXStart = data?.table?.x ?? data.cell.x;
                        // const tableWidth = data?.table?.width ?? (pdf.internal.pageSize.width - tableXStart - 20);
                        //let rowWidth = data.table.columns.reduce((sum: any, col: any) => sum + col.width, 0);

                        const lastColumn = data?.table.columns[data?.table.columns.length - 1];
                        const lastColumnEnd = lastColumn.x + lastColumn.width; // Rightmost point
                        const tableWidth = lastColumnEnd - tableXStart;
                        // Draw the background rectangle for the row
                        pdf.rect(rowXStart, rowYStart, rowWidth, rowHeight, "F");

                    }

                }
            });
        }

        return {
            xPosTable: xPosTable,
            tableHeight: tableHeight + 2,
            verticalLineX1: verticalLineX1,
            verticalLineX2: verticalLineX2,
            verticalLineY1: verticalLineY1,
            verticalLineY2: verticalLineY2
        }
    };


    console.log("option value", allValue)
    const generatePdf = async (salarySlip: ISalarySlip, table: HTMLTableElement) => {

        const pdf = new jsPDF({ compress: true });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const tableName = salarySlip.EMPCODE || "";
        // const statementDate = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
        let pdfFiles: { name: string; blob: Blob }[] = [];


        // Add an image (URL or base64 image)
        // const imgUrl = '/images/logo.png'; // Replace with your image URL or base64 string
        const imgpath = '/images/pdflogo.png'
        const imgUrl = (await getBase64ImageFromUrl(imgpath)) as string;
        const marginLeft = 20;
        const marginTop = 20;
        const imgWidth = 25; // Width of the image
        const imgHeight = 25; // Height of the image


        const xPosForWidth = (pageWidth - imgWidth) / 2;

        pdf.addImage(imgUrl, 'PNG', xPosForWidth, 8, imgWidth, imgHeight); // x=85, y=10, width=50, height=50

        // Title text (the one you want to change font size and family for)
        const title = "ADROIT CORPORATE SERVICES PVT LTD";

        // Set font family and size for only the title text 
        pdf.setFont("times", "bold");  // Set font family to 'times' and style to 'normal'
        pdf.setFontSize(15);  // Set font size to 12

        // Calculate the position to center the title text
        const textWidth = pdf.getTextWidth(title);
        const xPos = (pageWidth - textWidth) / 2; // Center the text horizontally
        pdf.text(title, xPos, 35);  // Add the title text to the PDF

        // Reset the font size and family for the rest of the text
        pdf.setFont("times", "normal");  // Set font family to 'helvetica' and style to 'normal'
        pdf.setFontSize(10);  // Reset font size to 10

        const year = statementDate.getFullYear();
        // Add some regular text after the title
        const bodyText = `Salary Slip for the month of ${result}, ${year}`;
        const bodyTextWidth = pdf.getTextWidth(bodyText);

        const xPosbodyText = (pageWidth - bodyTextWidth) / 2;
        pdf.text(bodyText, xPosbodyText, 40);  // Add body text to the PDF at (20, 50) position


        const columnBoldIndexmyTable: number[] = [0, 4, 6]
        let startY = 47
        const boldRowsIndexmyTable: number[] = [6, 21, 22]
        const alignLeftToColumnIndexMyTable: number[] = [0, 1, 2, 3, 4, 5]
        const alignLeftToRowIndexMyTable: number[] = [6, 7]
        const rowsWithBorders: number[] = [5, 20, 21]// New parameter to specify the rows that need borders
        // const table = document.getElementById(tableName) as HTMLTableElement;
        if (table) {
            const tableValues = setupTable
                (pdf,
                    table,
                    tableName,
                    startY,
                    columnBoldIndexmyTable,
                    boldRowsIndexmyTable,
                    alignLeftToColumnIndexMyTable,
                    alignLeftToRowIndexMyTable,
                    rowsWithBorders)

            const vertStartX = 10 + tableValues.verticalLineX1;  // Adjust based on desired X position
            const vertStartY = tableValues.verticalLineY1;  // Start at the Y position where your table starts
            const vertEndY = vertStartY + tableValues.verticalLineY2  // End of vertical line (adjust based on page height)
            //pdf.line(vertStartX, vertStartY, vertStartX, vertEndY);  // Draw vertical line


            // Title text (the one you want to change font size and family for)\
            const leftRightGap = 10;
            const titleAmountInWords = "Amount in words :"

            // Set font family and size for only the title text
            pdf.setFont("times", "normal");  // Set font family to 'times' and style to 'normal'
            pdf.setFontSize(10)

            const textWidthtitleAmountInWords = pdf.getTextWidth(titleAmountInWords);
            pdf.text(titleAmountInWords, leftRightGap + 4, startY + tableValues.tableHeight + 4);  // Add the title text to the PDF

            // Title text (the one you want to change font size and family for)\
            const amount = salarySlip?.NETSALARYINHAND?.replace(/,/g, "");
            const amountInWords = numberToWords(amount)


            // Set font family and size for only the title text
            pdf.setFont("times", "normal");  // Set font family to 'times' and style to 'normal'
            // Set font size to 12
            pdf.setFontSize(10)

            // Calculate the position to center the title text
            const textWidthAmountInWords = pdf.getTextWidth(amountInWords);
            const xPos = (pageWidth - textWidth) / 2; // Center the text horizontally
            pdf.text(amountInWords, leftRightGap + textWidthtitleAmountInWords + 4 + 3, startY + tableValues.tableHeight + 4);  // Add the title text to the PDF



            // Title text (the one you want to change font size and family for)\

            const titlePayBy = "Pay By:"

            // Set font family and size for only the title text
            pdf.setFont("times", "normal");  // Set font family to 'times' and style to 'normal'
            // Set font size to 12
            pdf.setFontSize(10)

            const titlePayByTextWidth = pdf.getTextWidth(titlePayBy);
            pdf.text(titlePayBy, leftRightGap + textWidthtitleAmountInWords + 4 + 3 + textWidthAmountInWords + 55, startY + tableValues.tableHeight + 4);  // Add the title text to the PDF


            // Title text (the one you want to change font size and family for)\

            const titleTransfer = "Transfer"

            // Set font family and size for only the title text
            pdf.setFont("times", "normal");  // Set font family to 'times' and style to 'normal'
            // Set font size to 12
            pdf.setFontSize(10)

            const titleTransferWidth = pdf.getTextWidth(titleTransfer);
            pdf.text(titleTransfer, leftRightGap + textWidthtitleAmountInWords + 4 + 3 + textWidthAmountInWords + 55 + titlePayByTextWidth + 4, startY + tableValues.tableHeight + 4);  // Add the title text to the PDF


            // Title text (the one you want to change font size and family for)
            const printed = "This is computer generated salary slip, hence signature is not required";

            // Set font family and size for only the title text
            pdf.setFont("times", "normal");  // Set font family to 'times' and style to 'normal'
            pdf.setFontSize(10)

            // Calculate the position to center the title text
            const textWidthPrinted = pdf.getTextWidth(title);
            const xPosPrinted = (pageWidth - textWidthPrinted) / 2; // Center the text horizontally
            pdf.text(printed, xPosPrinted - 4, startY + tableValues.tableHeight + 4 + 12);  // Add the title text to the PDF


            const fileName = `${salarySlip.EMPLOYEENAME}_${new Date().toLocaleDateString()}.pdf`;
            // pdf.save(fileName);

        }
        return pdf.output("blob");
    };



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const generateSalarySlipsZip = async (salarySlips: ISalarySlip[], table: HTMLTableElement) => {
        const zip = new JSZip();

        for (const salarySlip of salarySlips) {
            const pdfBlob = await generatePdf(salarySlip, table);
            const fileName = `${salarySlip.EMPLOYEENAME}_${new Date().toISOString().slice(0, 10)}.pdf`;
            zip.file(fileName, pdfBlob);
        }

        // Generate and trigger download
        zip.generateAsync({ type: "blob" }).then((zipBlob) => {
            saveAs(zipBlob, "Salary_Slips.zip");
        });
    };




    ///////////////////////////////////////////////////////////////////////////////////////////////////
    console.log("Statement date :", salarySlips)

    const formatToIndianRupees = (value: string | number | null | undefined): string => {
        if (value == null || value === '') return '';
        const number = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(number)) return '';
        return number.toLocaleString('en-IN');
    };




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
                {/* <a className='flex flex-row bg-sky-600 text-white px-3 py-1 rounded items-center' href={`${appURL}/files/Salary_Template.xlsx`}>Download Template</a> */}
                <div className='flex flex-row gap-4'>
                    <DatePicker
                        value={statementDate} format="MMM yyyy" caretAs={BsCalendar2MonthFill} onChange={handleDateChange} />
                </div>
                <div className='flex flex-row gap-4'>
                    <div>
                        <Select

                            options={employees}
                            isMulti
                            value={employeesFilter}

                            onChange={(value: readonly IEmployee[]) => {


                                setEmployeesFilter(value)
                                setOptcount(optcount + 1)
                                setAllValues(value)

                            }}
                            styles={customStyles}

                        />

                    </div>

                    <div>
                        {!loader && !isZipReady && <Button className='bg-sky-600 text-white px-3 py-2 rounded' type="button" onClick={()=>{downloadAll()}}>Generate Zip Folder</Button>}

                        {isZipReady && (
                            <Button className='bg-green-700 text-white px-3 py-2 rounded' type="button" onClick={downloadZipFile}>Download ZIP</Button>
                        )}
                        {/* {((allValue !== "All") || (!employeesFilter)) && <button onClick={fetchData} className='bg-sky-600 text-white px-3 py-2 rounded' type="button">
                            Download Salary Slips
                        </button>} */}

                        {loader && <Button isLoading className='bg-yellow-300 text-black px-3 py-2 rounded' type="button" >Please wait zip file creating...</Button>}

                    </div>



                </div>

                <div >
                    <div id="contentToPrint" style={{
                        width: '400px',
                        margin: '20px auto',
                        padding: '15px',
                        // border: "1px solid black"
                    }}>

                        {salarySlips.map((currentSalarySlipToDownload: ISalarySlip, index: number) => {
                            return (
                                <table hidden ref={(el) => (tableRefs.current[index] = el)} id={`#${currentSalarySlipToDownload.EMPCODE}`} style={{ width: '100%', fontSize: '10px' }}>
                                    <tbody>
                                        <tr style={{ height: '10px' }} >
                                            <td width="13" style={{ height: '10px' }}>Name</td>
                                            <td width="26" style={{ height: '10px' }}  >: {currentSalarySlipToDownload.EMPLOYEENAME != null ? currentSalarySlipToDownload.EMPLOYEENAME.toString() : ''}</td>
                                            <td width="3" style={{ height: '10px' }}></td>
                                            {/* <td width="6" style={{ height: '18px' }}></td> */}


                                            <td width="14" style={{ height: '10px' }}>Emp Code</td>
                                            <td width="25" style={{ height: '10px' }}>: {currentSalarySlipToDownload.EMPCODE != null ? currentSalarySlipToDownload.EMPCODE.toString() : ''}</td>
                                            <td width="2" style={{ height: '10x' }}></td>
                                            <td width="11" style={{ height: '10px' }}>Present</td>
                                            <td width="6" style={{ height: '10px' }}>
                                                : {currentSalarySlipToDownload.PRESENTDAYS != null ? currentSalarySlipToDownload.PRESENTDAYS.toString() : ''}
                                            </td>
                                        </tr>
                                        <tr style={{ height: '10px' }}>
                                            <td width="14" style={{ height: '12px' }}>Basic Salary</td>
                                            <td width="18" style={{ height: '12px' }}>: {currentSalarySlipToDownload.BASICSTRUCTURE != null ? formatToIndianRupees(currentSalarySlipToDownload.BASICSTRUCTURE) : ''}</td>
                                            <td width="9" style={{ height: '12px' }}></td>


                                            <td width="14" style={{ height: '12px' }}>DOJ</td>
                                            <td width="15" style={{ height: '12px' }}>: {currentSalarySlipToDownload.DOJ != null ? currentSalarySlipToDownload.DOJ.toString() : ''}</td>
                                            <td width="9" style={{ height: '12px' }}></td>
                                            <td width="14" style={{ height: '12px' }}>Absent</td>
                                            <td width="7" style={{ height: '12px' }}>
                                                : {currentSalarySlipToDownload.ABSENTDAYS != null ? currentSalarySlipToDownload.ABSENTDAYS.toString() : ''}
                                            </td>
                                        </tr>

                                        <tr >
                                            <td width="14" style={{ height: '18px' }}>Gross Salary</td>
                                            <td width="18" style={{ height: '18px' }}>: {currentSalarySlipToDownload.GROSSPMSTRUCTURE != null ? formatToIndianRupees(currentSalarySlipToDownload.GROSSPMSTRUCTURE) : ''}</td>
                                            <td width="9" style={{ height: '18px' }}></td>


                                            <td width="14" style={{ height: '18px' }}>Department</td>
                                            <td width="15" style={{ height: '18px' }}>: {currentSalarySlipToDownload.TEAM != null ? currentSalarySlipToDownload.TEAM.toString() : ''}</td>
                                            <td width="9" style={{ height: '18px' }}></td>
                                            <td width="14" style={{ height: '18px' }}>Leave</td>
                                            <td width="7" style={{ height: '18px' }}>
                                                : {currentSalarySlipToDownload.LALEAVENTAKEN != null ? currentSalarySlipToDownload.LALEAVENTAKEN.toString() : ''}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td width="14" style={{ height: '18px' }}>PF No.</td>
                                            <td width="18" style={{ height: '18px' }}>: {currentSalarySlipToDownload.EPFUANNO != null ? currentSalarySlipToDownload.EPFUANNO.toString() : ''}</td>
                                            <td width="9" style={{ height: '18px' }}></td>


                                            <td width="14" style={{ height: '18px' }}>Designation</td>
                                            <td width="19" style={{ height: '18px' }}>: {currentSalarySlipToDownload.DESIGNATION != null ? currentSalarySlipToDownload.DESIGNATION.toString() : ''}</td>
                                            <td width="5" style={{ height: '18px' }}></td>
                                            <td width="14" style={{ height: '18px' }}>Paid Days</td>
                                            <td width="7" style={{ height: '18px' }}>
                                                : {currentSalarySlipToDownload.PAIDDAYS != null ? currentSalarySlipToDownload.PAIDDAYS.toString() : ''}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td width="14" style={{ height: '18px' }}>ESIC No</td>
                                            <td width="18" style={{ height: '18px' }}>: {currentSalarySlipToDownload.ESICNO != null ? currentSalarySlipToDownload.ESICNO.toString() : ''}</td>
                                            <td width="9" style={{ height: '18px' }}></td>


                                            <td width="14" style={{ height: '18px' }}>Leave Balance</td>
                                            <td width="15" style={{ height: '18px' }}>: {currentSalarySlipToDownload.LEAVECF != null ? currentSalarySlipToDownload.LEAVECF.toString() : ''}</td>
                                            <td width="9" style={{ height: '18px' }}></td>
                                            <td width="14" style={{ height: '18px' }}>WFH</td>
                                            <td width="7" style={{ height: '18px' }}>
                                                : {currentSalarySlipToDownload.WFH != null || currentSalarySlipToDownload.WFH != undefined ? currentSalarySlipToDownload.WFH.toString() : ''}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="13" style={{ height: '18px' }}>Mediclaim No</td>
                                            <td width="26" style={{ height: '18px' }}>: {currentSalarySlipToDownload.MEDICLAIMNO != null ? currentSalarySlipToDownload.MEDICLAIMNO.toString() : ''}</td>
                                            <td width="5" style={{ height: '18px' }}></td>


                                            <td width="13" style={{ height: '18px' }}></td>
                                            <td width="20" style={{ height: '18px' }}></td>
                                            <td width="3" style={{ height: '18px' }}></td>
                                            <td width="13" style={{ height: '18px' }}></td>
                                            <td width="7" style={{ height: '18px' }}>

                                            </td>
                                        </tr>
                                        {/* </tbody>

                                    <tbody> */}

                                        {/* Earnings and Deductions Section */}
                                        <tr >
                                            <td width="18.6666666667" style={{ height: '18px' }}>Earnings </td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>Monthly Gross</td>
                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>Earned Salary</td>



                                            <td width="20" style={{ height: '18px' }} colSpan={1}> Deductions  </td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}> </td>
                                        </tr>
                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Basic + DA</td>
                                            <td width="14.6666666667" style={{ height: '18px' }} >  {currentSalarySlipToDownload.BASICSTRUCTURE != null || currentSalarySlipToDownload.BASICSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.BASICSTRUCTURE) : ''}</td>
                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2} >                                            <td width="16.6666666667" style={{ height: '18px' }}>  {currentSalarySlipToDownload.BASIC != null || currentSalarySlipToDownload.BASIC != undefined ? formatToIndianRupees(currentSalarySlipToDownload.BASIC) : ''}</td>
                                            </td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>Provident Fund</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }} > {currentSalarySlipToDownload.PF != null || currentSalarySlipToDownload.PF != undefined ? formatToIndianRupees(currentSalarySlipToDownload.PF) : ''}
                                            </td>
                                        </tr>


                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>HRA</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>                                             {currentSalarySlipToDownload.HRASTRUCTURE != null || currentSalarySlipToDownload.HRASTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.HRASTRUCTURE) : ''}</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>                                            <td width="16.6666666667" style={{ height: '18px' }}>  {currentSalarySlipToDownload.HRA != null || currentSalarySlipToDownload.HRA != undefined ? formatToIndianRupees(currentSalarySlipToDownload.HRA) : ''}</td>
                                            </td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>E.S.I.C</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }} >                                               {currentSalarySlipToDownload.ESIC != null || currentSalarySlipToDownload.ESIC != undefined ? formatToIndianRupees(currentSalarySlipToDownload.ESIC) : ''}</td>

                                        </tr>



                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Conveyance</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>                                             {currentSalarySlipToDownload.CONVSTRUCTURE != null || currentSalarySlipToDownload.CONVSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.CONVSTRUCTURE) : ''}</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.CONV != null || currentSalarySlipToDownload.CONV != undefined ? formatToIndianRupees(currentSalarySlipToDownload.CONV) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>Professional Tax</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }} >                                               {currentSalarySlipToDownload.PT != null || currentSalarySlipToDownload.PT != undefined ? formatToIndianRupees(currentSalarySlipToDownload.PT) : ''}</td>

                                        </tr>



                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Medical Allow</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>                                             {currentSalarySlipToDownload.MEDSTRUCTURE != null || currentSalarySlipToDownload.MEDSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.MEDSTRUCTURE) : ''}</td>
                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.MED != null || currentSalarySlipToDownload.MED != undefined ? formatToIndianRupees(currentSalarySlipToDownload.MED) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>Income Tax</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  >                                               {currentSalarySlipToDownload.TDS != null || currentSalarySlipToDownload.TDS != undefined ? formatToIndianRupees(currentSalarySlipToDownload.TDS) : ''}</td>

                                        </tr>


                                        <tr>
                                            <td width="20.6666666667" style={{ height: '18px' }}>Education Allow</td>
                                            <td width="12.6666666667" style={{ height: '18px' }}>                                             {currentSalarySlipToDownload.EDUSTRUCTURE != null || currentSalarySlipToDownload.EDUSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.EDUSTRUCTURE) : ''}</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.EDU != null || currentSalarySlipToDownload.EDU != undefined ? formatToIndianRupees(currentSalarySlipToDownload.EDU) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>Other Deduction</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }} >                                               {currentSalarySlipToDownload.OTHERDEDUCTION != null || currentSalarySlipToDownload.OTHERDEDUCTION != undefined ? formatToIndianRupees(currentSalarySlipToDownload.OTHERDEDUCTION) : ''}</td>

                                        </tr>


                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>CCA</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>                                             {currentSalarySlipToDownload.CCASTRUCTURE != null || currentSalarySlipToDownload.CCASTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.CCASTRUCTURE) : ''}</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.CCA != null || currentSalarySlipToDownload.CCA != undefined ? formatToIndianRupees(currentSalarySlipToDownload.CCA) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>Gratuity</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }} >                                              {currentSalarySlipToDownload.GRATUITYPM != null || currentSalarySlipToDownload.GRATUITYPM != undefined ? formatToIndianRupees(currentSalarySlipToDownload.GRATUITYPM) : ''}</td>

                                        </tr>


                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Shift Allow</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>0</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>0</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>Mediclaim</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  >          {currentSalarySlipToDownload.MEDICLAIMPM != null || currentSalarySlipToDownload.MEDICLAIMPM != undefined ? formatToIndianRupees(currentSalarySlipToDownload.MEDICLAIMPM) : ''}</td>

                                        </tr>


                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Incentives</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>0</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.INCENTIVES != null || currentSalarySlipToDownload.INCENTIVES != undefined ? formatToIndianRupees(currentSalarySlipToDownload.INCENTIVES) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>WFH</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  >                                                {currentSalarySlipToDownload.WFHDEDUCTION != null || currentSalarySlipToDownload.WFHDEDUCTION != undefined ? formatToIndianRupees(currentSalarySlipToDownload.WFHDEDUCTION) : ''}</td>

                                        </tr>


                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Other Allow</td>

                                            <td width="14.6666666667" style={{ height: '18px' }}>0</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.OTHERARREARS != null || currentSalarySlipToDownload.OTHERARREARS != undefined ? formatToIndianRupees(currentSalarySlipToDownload.OTHERARREARS) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}>Labour Welfare Fund</td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  >                                               {currentSalarySlipToDownload.LWF != null || currentSalarySlipToDownload.LWF != undefined ? formatToIndianRupees(currentSalarySlipToDownload.LWF) : ''}</td>

                                        </tr>

                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Gratuity</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>                                              {currentSalarySlipToDownload.GRATUITYPMSTRUCTURE != null || currentSalarySlipToDownload.GRATUITYPMSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.GRATUITYPMSTRUCTURE) : ''}
                                            </td>
                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.GRATUITYPMSTRUCTURE != null || currentSalarySlipToDownload.GRATUITYPMSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.GRATUITYPMSTRUCTURE) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}> </td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  >
                                            </td>
                                        </tr>



                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Mediclaim</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>                                              {currentSalarySlipToDownload.MEDICLAIMPMSTRUCTURE != null || currentSalarySlipToDownload.MEDICLAIMPMSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.MEDICLAIMPMSTRUCTURE) : ''}</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.MEDICLAIMPMSTRUCTURE != null || currentSalarySlipToDownload.MEDICLAIMPMSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.MEDICLAIMPMSTRUCTURE) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}> </td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }} >
                                            </td>
                                        </tr>





                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Provident Fund</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>                                              {currentSalarySlipToDownload.EMPLOYERPFPMSTRUCTURE != null || currentSalarySlipToDownload.EMPLOYERPFPMSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.EMPLOYERPFPMSTRUCTURE) : ''}
                                            </td>
                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.EMPLOYERPFPMSTRUCTURE != null || currentSalarySlipToDownload.EMPLOYERPFPMSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.EMPLOYERPFPMSTRUCTURE) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}> </td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  >
                                            </td>
                                        </tr>


                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>E.S.I.C</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>                                              {currentSalarySlipToDownload.EMPLOYERESICSTRUCTURE != null || currentSalarySlipToDownload.EMPLOYERESICSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.EMPLOYERESICSTRUCTURE) : ''}</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>                                        {currentSalarySlipToDownload.EMPLOYERESICSTRUCTURE != null || currentSalarySlipToDownload.EMPLOYERESICSTRUCTURE != undefined ? formatToIndianRupees(currentSalarySlipToDownload.EMPLOYERESICSTRUCTURE) : ''}</td>

                                            <td width="20" style={{ height: '18px' }} colSpan={2}> </td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  >
                                            </td>
                                        </tr>


                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Bonus</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>0</td>

                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.BONUS != null || currentSalarySlipToDownload.BONUS != undefined ? formatToIndianRupees(currentSalarySlipToDownload.BONUS) : ''}</td>
                                            </td>
                                            <td width="20" style={{ height: '18px' }} colSpan={2}> </td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  >
                                            </td>
                                        </tr>



                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Total Earnings</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>
                                            </td>
                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.TOTALCALCULATEDGROSSASPERPRESENDAYS != null || currentSalarySlipToDownload.TOTALCALCULATEDGROSSASPERPRESENDAYS != undefined ? formatToIndianRupees(currentSalarySlipToDownload.TOTALCALCULATEDGROSSASPERPRESENDAYS) : ''}</td>
                                            </td>
                                            <td width="20" style={{ height: '18px' }} colSpan={2}>Total Deductions </td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }} >                                              {currentSalarySlipToDownload.TOTALDEDUCTION != null || currentSalarySlipToDownload.TOTALDEDUCTION != undefined ? formatToIndianRupees(currentSalarySlipToDownload.TOTALDEDUCTION) : ''}</td>

                                        </tr>

                                        <tr>
                                            <td width="18.6666666667" style={{ height: '18px' }}>Net Pay</td>
                                            <td width="14.6666666667" style={{ height: '18px' }}>
                                            </td>
                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>                                            <td width="16.6666666667" style={{ height: '18px' }} colSpan={2}>  {currentSalarySlipToDownload.NETSALARYINHAND != null || currentSalarySlipToDownload.NETSALARYINHAND != undefined ? formatToIndianRupees(currentSalarySlipToDownload.NETSALARYINHAND) : ''}</td>
                                            </td>
                                            <td width="20" style={{ height: '18px' }} colSpan={2}> </td>
                                            <td width="5" style={{ height: '18px' }}> </td>
                                            <td width="25" style={{ height: '18px' }}  > </td>

                                        </tr>


                                    </tbody>
                                </table>
                            )
                        })}


                    </div>
                </div>
            </div >
        </div >
    )
}

export default GenerateSalarySlipPage
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import AdroitLogo from '@/public/images/logo.png'
import Image from "next/image";
import { MdDashboard } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import { FaUserGroup } from "react-icons/fa6";
import { LiaUsersSolid } from "react-icons/lia";
import { FaUserTie } from "react-icons/fa";
import { AiFillCheckSquare } from "react-icons/ai";
import { AiFillContacts } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { TiNews } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { LiaPercentageSolid } from "react-icons/lia";
import styles from "./Sidebar.module.css";


interface IUser {
    fullname: string;
    role: string;
    id: number;
    username: string;
}
function SidebarComponent() {
    const router = useRouter();

    const [user, setUser] = useState<IUser>({
        fullname: "",
        role: "",
        id: 0,
        username: ""
    })

    const [hovered, setHovered] = useState(null);
    const [active, setActive] = useState(null);



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

    const handleLogout = async () => {
        await localStorage.removeItem('token')
        return router.push("/login")
    }

    //console.log("path url :", pathname)

    return (
        // <div className='flex flex-col h-[100vh] w-full fixed top-0 bottom-0 left-0 right-0'>
        <div className='flex flex-col w-full h-full relative top-0 bottom-0 left-0 right-0'>
            <nav className='flex flex-col mt-3 w-full '>
                <div className=" mb-3 flex flex-row justify-center">
                    <Image src={AdroitLogo} alt="Adroid Logo " width="100" height="100" />
                </div>
                {(user.role === "admin" || user.role === "manager" || user.role === "reports") && <Link className=" no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2 border-t-1 "
                    href={"/taskapp/dashboard"}
                    style={{}}
                >
                    <MdDashboard />
                    <span>Dashboard</span>
                </Link>}

                {(user.role === "reports") && <Link className=" no-underline text-inherit hover:no-underline sidebar_link  flex flex-row items-center gap-2 border-b-1 focus:outline-none active:no-underline" href={"/taskapp/uploadsalary"}>
                    <BiSolidReport />
                    <span>Upload Salary</span>
                </Link>}

                {(user.role === "reports") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2 border-b-1 focus:outline-none active:no-underline" href={"/taskapp/generatesalaryslip"}>
                    <BiSolidReport />
                    <span>Generate Salary Slips</span>
                </Link>}

                {(user.role === "admin" || user.role === "manager" || user.role === "reports") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2 border-b-1" href={"/taskapp/reports"}>
                    <BiSolidReport />
                    <span>Reports</span>
                </Link>}

                {(user.role === "admin" || user.role === "manager") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2" href={"/taskapp/users"}><FaUserGroup /><span>Users</span></Link>}

                {(user.role === "admin" || user.role === "manager") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2" href={"/taskapp/managerteammapping"}><LiaUsersSolid /><span>Team Mapping</span></Link>}

                {(user.role === "admin" || user.role === "manager") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2" href={"/taskapp/products"}><TiNews /><span>Products</span></Link>}

                {(user.role === "admin" || user.role === "manager") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2" href={"/taskapp/clients"}><FaUserTie /><span>Clients</span></Link>}

                {(user.role === "admin" || user.role === "manager") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2" href={"/taskapp/projects"}><FaEdit /><span>Projects</span></Link>}

                {/* {(user.role === "admin" || user.role === "manager") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2" href={"/taskapp/module"}><LiaPercentageSolid /><span>Modules</span></Link>} */}

                {(user.role === "admin" || user.role === "manager") && <Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2" href={"/taskapp/taskdescription"}><AiFillContacts /><span>Task Description</span></Link>}

                {(user.role === "admin" || user.role === "manager" || user.role === "user" || user.role === "support") && (<Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2 border-b-1" href={"/taskapp/tasks"}><AiFillCheckSquare /><span>Tasks</span></Link>)}

                {(user.role && user.role === "user") && (<Link className="no-underline text-inherit hover:no-underline sidebar_link flex flex-row items-center gap-2 border-b-1" href={"/taskapp/usertimesheetreport"}> <BiSolidReport /><span>Timesheet Report</span></Link>)}

                {/* <Link className="sidebar_link flex flex-row items-center gap-2" href={"/taskapp/timesheet"}>Timesheet</Link> */}
                <div className='flex flex-col absolute bottom-0 border-t-1 left-0 right-0'>
                    <Link className="no-underline text-white hover:no-underline sidebar_link flex flex-row items-center gap-2" href={"/taskapp/users/changepassword"}><RiLockPasswordFill /><span>Change Password</span></Link>
                    <span className="text-white hover:text-white sidebar_link flex flex-row items-center gap-2 cursor-pointer" onClick={handleLogout}><RiLogoutBoxRLine /><span>Logout</span> </span>
                    <span className="border border-x-0 border-t-1 border-b-0 border-slate-100 p-2 w-full flex flex-row gap-2 items-center"><FaUserCircle /><span>{user.fullname}</span></span>
                </div>
            </nav>
        </div>
    )
}

export default SidebarComponent
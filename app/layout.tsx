import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import 'rsuite/dist/rsuite.min.css';
import SidebarComponent from "./components/SidebarComponent";
import { Providers } from "./providers";
import useAuthToken from "./useAuthToken";
import AuthComponent from "./AuthComponent";
import "react-datetime/css/react-datetime.css";
import { useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';


// import 'react-datetime-picker/dist/DateTimePicker.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adroit - Task Management",
  description: "Task Management App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

//className="dark text-foreground bg-background"
//bg-sky-50
  // const token = useAuthToken();
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-sky-50">
          <ToastContainer />

          <Providers >
            {children}
          </Providers>

        </div>
      </body>
    </html>
  );
}

import AuthComponent from "../AuthComponent";
import SidebarComponent from "../components/SidebarComponent";

export default async function TaskappLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AuthComponent pageType="taskapp" />

            <div className="flex flex-row h-[100vh]  overflow-hidden w-[100vw]">
                <div className="flex w-[16.25rem] bg-sky-600 text-white h-full"><SidebarComponent /></div>

                <div className="flex flex-row h-full flex-grow  overflow-y-auto w-full">
                    <div className="flex  pl-4 pr-6 bg-sky-50  w-full">  {children}</div>
                </div>
            </div>

        </>
    );
}

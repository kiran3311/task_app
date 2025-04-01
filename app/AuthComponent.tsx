'use client'
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'








interface IUser {
    fullname: string;
    role: string;
    id: number;
    username: string;
}

function AuthComponent({ pageType }: { pageType: string }) {

    const [user, setUser] = useState<IUser>({
        fullname: "",
        role: "user",
        id: 0,
        username: ""
    })

    const [token, setToken] = useState(false)

    const [storageChange, setStorageChange] = useState(false);

    // useEffect(() => {
    //     const checkTokenExpiration = () => {
    //       const tokenExpiration = localStorage.getItem('token');
    //       if (tokenExpiration) {
    //         const decoded = jwtDecode(tokenExpiration);
    //         const expirationTime = parseInt(tokenExpiration, 10);
    //         const currentTime = Date.now() / 1000; // Convert to seconds

    //         if(decoded && decoded.exp){
    //             if (currentTime > decoded.exp ) {
    //                 // Token expired, clear local storage
    //                 localStorage.removeItem('token');
    //                 return router.push("/login")
    //               }
    //         }
    //       }
    //     };

    //     checkTokenExpiration();
    //   }, []);


    // Check if token is expired
    // function isTokenExpired(token) {
    //     const decodedToken = jwtDecode(token);
    //     if (!decodedToken || !decodedToken.exp) {
    //         return true; // Unable to decode token or no expiry time
    //     }
    //     const currentTime = Math.floor(Date.now() / 1000);
    //     return decodedToken.exp < currentTime;
    // }

    const router = useRouter();
    const pathname = usePathname()


    let currTime = new Date()


    useEffect(() => {
        async function getToken() {
            try {
                const token = await localStorage.getItem("token")


                if (pageType !== 'login' && (!token || (token && token?.length <= 0)) ) {
                    setToken(false)
                    return router.push("/login")
                }

                if (pageType === 'login' && token && token.length > 0) {
                    const decoded: IUser = await jwtDecode(token)
                    setUser(decoded)
                    setToken(true)
                    console.log("token decode ===> ", decoded)
                    if (decoded.role === "admin" || decoded.role === "manager") {
                        return router.push("/taskapp/dashboard")
                    }
                    if (decoded.role === "reports") {
                        return router.push("/taskapp/reports")
                    }

                    return router.push("/taskapp/tasks")
                }
            } catch (err) {
                console.log("ERROR IN AUTHTOKEN ", err)
            }
        }
        getToken()
    }, [storageChange,router, pageType])


    useEffect(() => {
        function clearToken() {
            try {
                const token: any = localStorage.getItem("token");
                const decoded: any = jwtDecode(token);
                if (checkTokenExpire(decoded) ) {
                    localStorage.removeItem("token");

                    setToken(false)
                    window.alert("Session Timeout Please Login again..")
                    return router.push("/login");
                }

            } catch (err) {
                console.log("ERROR IN AUTHTOKEN ", err);
            }
        }

        clearToken();
    }, [storageChange,pathname, currTime])


    // Function to check if token is expired
    const checkTokenExpire = (decoded: any) => {
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    }



    useEffect(() => {
        const handleStorageChange = () => {
          // Update state to trigger re-render
          setStorageChange((prev) => !prev);
        };
    
        // Add event listener for storage change
        window.addEventListener('storage', handleStorageChange);
    
        return () => {
          // Cleanup: Remove event listener when component unmounts
          window.removeEventListener('storage', handleStorageChange);
        };
      }, [currTime]);



 

    return null;
}

export default AuthComponent;
"use client";
// useAuthToken.js
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function useAuthToken() {
 
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    useEffect(() => {
        // Fetch token from localStorage
        const storedToken = localStorage.getItem('token');

        if (storedToken) {
            setToken(storedToken);
        }
        else{
            return router.push("/login")

        }
      

    }, []); // Empty dependency array means this effect runs only once, similar to componentDidMount

    return token;
};



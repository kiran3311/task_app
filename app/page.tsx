'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    async function getToken() {
      const token = await sessionStorage.getItem('token');
      
     // localStorage.getItem("token")

      if ((!token || (token && token?.length <= 0))) {
        return router.push("/login")
      }

      if (token && token.length > 0) {
        return router.push("/taskapp/tasks")
      }
    }
    getToken()
  }, [router])
  return (
    <></>
  );
}

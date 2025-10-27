"use client"
import RoomCards from '@/components/RoomCards'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function page() {
  const router = useRouter();

  useEffect(() => {
    const admin = localStorage.getItem("adminAuth");
    if (!admin) {
      router.push("/login");
    }
  }, [router]);
  return (
    <div>
      <RoomCards />
    </div>
  )
}

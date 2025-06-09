"use client"
import RoomFilters from '@/components/RoomFilters'
// import RoomGridDummy from '@/components/RoomGridDummy'
import RoomGrid from '@/components/RoomGrid'
import React from 'react'

export default function page() {
  return (
    <div>
<RoomFilters />
<RoomGrid />
{/* <RoomGridDummy /> */}
    </div>
  )
}

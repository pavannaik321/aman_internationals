"use client";

import { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";


export default function CheckInFilters() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bulkBooking, setBulkBooking] = useState(true);


    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };



    return (
        <div className="flex flex-col flex-wrap gap-8 items-center justify-between p-4">
            {/* Section 1 */}
            <div className="flex flex-row items-center justify-between w-full">

                {/* Date Picker */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => changeDate(-1)}
                        className="border rounded p-1 text-gray-500 hover:bg-gray-100"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-gray-700 font-medium">
                        {formatDate(selectedDate)} <span className="text-black">Today</span>
                    </span>
                    <button
                        onClick={() => changeDate(1)}
                        className="border rounded p-1 text-gray-500 hover:bg-gray-100"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />


                {/* Bulk Booking */}
                <label className="flex items-center gap-2 text-gray-700">
                    <span>Bulk Booking</span>
                    <input
                        type="checkbox"
                        checked={bulkBooking}
                        onChange={(e) => setBulkBooking(e.target.checked)}
                        className="w-4 h-4 border border-gray-400 rounded"
                    />
                </label>

                {/* Buttons 1*/}
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800">
                    Search Rooms
                </button>
            </div>

        </div>
    );
}

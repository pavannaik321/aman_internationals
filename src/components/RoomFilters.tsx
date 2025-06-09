"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useRoomFilter } from "@/store/useRoomFilter";
export default function RoomFilters() {
    const { setFilters, triggerFetch } = useRoomFilter();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bulkBooking, setBulkBooking] = useState(false);
    // const [room_type_open, setRoom_type_open] = useState(false);
    // const [room_type, setRoom_type] = useState("All AC/NON AC");
    // const [no_of_rooms_open, setNo_of_room_open] = useState(false);
    // const [no_of_room, setNo_of_room] = useState(2);
    const [category_open, setCategory_open] = useState(false);
    const [category, setCategory] = useState("All Category Rooms");

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };
    useEffect(() => {
        setFilters({
            date: selectedDate,
            category,
            // numberOfRooms: no_of_room,
            bulkBooking,
        });

        // triggerFetch();
    }, [category, selectedDate, bulkBooking])



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

                {/* Room Type */}
                {/* <div className="relative inline-block">
                    <button
                        onClick={() => setRoom_type_open(!room_type_open)}
                        className="border w-xs text-start border-gray-300 bg-white text-gray-500 text-lg px-4 py-1 rounded focus:outline-none"
                    >
                        {room_type}
                        <span className="ml-2 text-gray-400 inline-grid">
                            {room_type_open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                    </button>

                    <div
                        className={`absolute top-full w-xs right-0 bg-white rounded-lg p-4 mt-1 shadow-md transform origin-top transition-all duration-200 ${room_type_open ? 'scale-y-100' : 'scale-y-0'
                            }`}
                    >
                        <button
                            onClick={() => {
                                setRoom_type("All AC/NON AC");
                                setRoom_type_open(false);
                            }
                            }
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-800"
                        >
                            All AC/NON AC
                        </button>
                        <button
                            onClick={() => {
                                setRoom_type("A/C");
                                setRoom_type_open(false);
                            }
                            }
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-800"
                        >
                            A/C Category
                        </button>
                        <button
                            onClick={() => {
                                setRoom_type("NON A/C");
                                setRoom_type_open(false);
                            }
                            }
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-800"
                        >
                            Non A/C Category
                        </button>

                    </div>
                </div> */}

                {/* Room Category */}
                <div className="relative inline-block">
                    <button
                        onClick={() => setCategory_open(!category_open)}
                        className="border text-start w-xs border-gray-300 bg-white text-gray-500 text-lg px-4 py-1 rounded focus:outline-none"
                    >
                        {category}
                        <span className="ml-2 text-gray-400 inline-grid">
                            {category_open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                    </button>

                    <div
                        className={`absolute w-xs top-full right-0 bg-white rounded-lg p-4 mt-1 shadow-md transform origin-top transition-all duration-200 ${category_open ? 'scale-y-100' : 'scale-y-0'
                            }`}
                    >
                        <button
                            onClick={() => {
                                setCategory("All Category Rooms");
                                setCategory_open(false);
                            }
                            }
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-800"
                        >
                            All Category Rooms
                        </button>
                        <button
                            onClick={() => {
                                setCategory("Standard A/C");
                                setCategory_open(false);
                            }
                            }
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-800"
                        >
                            Standard A/C
                        </button>
                        <button
                            onClick={() => {
                                setCategory("Standard Plus");
                                setCategory_open(false);
                            }
                            }
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-800"
                        >
                            Standard Plus
                        </button>
                        <button
                            onClick={() => {
                                setCategory("SUITE/ CLUB A/C");
                                setCategory_open(false);
                            }
                            }
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-800"
                        >
                            SUITE/ CLUB A/C
                        </button>
                        <button
                            onClick={() => {
                                setCategory("Standard Non A/C");
                                setCategory_open(false);
                            }
                            }
                            className="block px-2 py-1 hover:bg-gray-100 rounded text-sm text-gray-800"
                        >
                            Standard Non A/C
                        </button>
                    </div>
                </div>


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
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800" onClick={() => {

                    setFilters({
                        date: selectedDate,
                        category,
                        // numberOfRooms: no_of_room,
                        bulkBooking,
                    });

                    triggerFetch();
                }
                }>
                    Search Rooms
                </button>
            </div>
            {/* Section 2 */}
            {/* <div className="flex flex-row items-center justify-between w-full"> */}
            {/* Room Count Dropdown */}

            {/* <div className="relative inline-block">
                    <button
                        onClick={() => setNo_of_room_open(!no_of_rooms_open)}
                        className="border text-start w-s border-gray-300 bg-white text-gray-500 text-lg px-4 py-1 rounded focus:outline-none"
                    >
                        Select Number of Rooms  {no_of_room}
                        <span className="ml-2 text-gray-400 inline-grid">
                            {no_of_rooms_open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                    </button>

                    <div
                        className={`absolute w-1/2 top-full right-0 bg-white rounded-lg p-4 mt-1 shadow-md transform origin-top transition-all duration-200 ${no_of_rooms_open ? 'scale-y-100' : 'scale-y-0'
                            }`}
                    >

                        {Array.from({ length: 19 }, (_, i) => i + 2).map((num) => (
                            <button
                                key={num}
                                onClick={() => {
                                    setNo_of_room(num);
                                    setNo_of_room_open(false);
                                }}
                                className="block py-1 px-1 text-center w-full hover:bg-gray-100 rounded text-sm text-gray-800"
                            >
                                {num}
                            </button>
                        ))}

                    </div>
                </div> */}

            {/* Buttons 2*/}
            {/* <button
                    className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
                    onClick={() => {
                        if ( !bulkBooking || category === "All Category Rooms") {
                            alert("Please select a specific room category before booking.");
                            return;
                        }


                         setFilters({
                        date: selectedDate,
                        category,
                        numberOfRooms: no_of_room,
                        bulkBooking,
                    });

                    triggerBulkBooking();
                    }}
                >
                    Book Rooms
                </button> */}

            {/* </div> */}

        </div>
    );
}
